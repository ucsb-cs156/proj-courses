import asyncio
import sys
import time
import aiohttp


async def test_rate_limiter(url, total_requests):
    # Use a custom TCPConnector to bypass standard limits
    # limit=0 allows unlimited simultaneous connections
    connector = aiohttp.TCPConnector(limit=0, ttl_dns_cache=300)

    # Disable keep-alive timeouts to prevent connection recycling overhead during the burst
    timeout = aiohttp.ClientTimeout(total=30)

    success_count = 0
    hit_429 = False
    start_time = time.perf_counter()

    async with aiohttp.ClientSession(
        connector=connector, timeout=timeout
    ) as session:

        async def make_request():
            nonlocal success_count, hit_429
            if hit_429:
                return

            try:
                async with session.get(url) as response:
                    if response.status == 429:
                        hit_429 = True
                    else:
                        success_count += 1
            except Exception:
                # Silently catch network errors/dropped connections to keep speed maxed
                pass

        # Create all tasks up front
        tasks = []
        for _ in range(total_requests):
            tasks.append(asyncio.create_task(make_request()))

        # Execute concurrently and monitor for the 429 abort trigger
        for task in asyncio.as_completed(tasks):
            await task
            if hit_429:
                # Cancel all remaining pending tasks immediately
                for t in tasks:
                    if not t.done():
                        t.cancel()
                break

    end_time = time.perf_counter()
    elapsed = end_time - start_time

    # Calculate and output results
    print("--- Results ---")
    print(f"Total Requests Attempted: {success_count + (1 if hit_429 else 0)}")
    print(f"Successful (Non-429):    {success_count}")
    print(f"Hit 429 Rate Limit:      {hit_429}")
    print(f"Elapsed Time:            {elapsed:.4f} seconds")

    if elapsed > 0:
        rps = success_count / elapsed
        print(f"Requests Per Second:     {rps:.2f}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python rate_tester.py <url> <number_of_requests>")
        print(
            "Example: python rate_tester.py https://example.com/api/public/currentQuarter 5000"
        )
        sys.exit(1)

    target_url = sys.argv[1]

    # Quick sanity check on the URL format
    if not target_url.startswith(("http://", "https://")):
        print("Error: URL must start with http:// or https://")
        sys.exit(1)

    try:
        req_count = int(sys.argv[2])
    except ValueError:
        print("Error: Please provide a valid integer for the request count.")
        sys.exit(1)

    # Run the async loop
    asyncio.run(test_rate_limiter(target_url, req_count))
