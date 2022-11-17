// based in part on this SO answer: https://codereview.stackexchange.com/a/211511

export default function Plaintext({text}) {
  if (text==null) {
    return (<pre data-testid="plaintext-empty"></pre>)
  }
  const textToRender = typeof text === "string" ? text : JSON.stringify(text, null, 2);
  const [firstLine, ...rest] = textToRender.split('\n')
  return (
    <pre data-testid="plaintext">
      <span>{ firstLine }</span>
      {
        rest.map((line) => (
          <>
            <br />
            <span>{ line }</span>
          </>
        ))
      }
    </pre>
  );
}