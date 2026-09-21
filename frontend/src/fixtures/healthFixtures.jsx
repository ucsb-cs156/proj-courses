// Responses from /api/actuator/health (Spring Boot Actuator).
// The backend answers 200 for allUp, and 503 for each of the others.
const component = (status) => ({ status });

const health = (status, db, mongo) => ({
  status,
  components: {
    db: component(db),
    diskSpace: component("UP"),
    mongo: component(mongo),
    ping: component("UP"),
    ssl: component("UP"),
  },
});

const healthFixtures = {
  allUp: health("UP", "UP", "UP"),
  mongoDown: health("DOWN", "UP", "DOWN"),
  sqlDown: health("DOWN", "DOWN", "UP"),
  bothDown: health("DOWN", "DOWN", "DOWN"),
};

export { healthFixtures };
