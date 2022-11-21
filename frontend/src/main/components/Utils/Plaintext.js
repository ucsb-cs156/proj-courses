// based in part on this SO answer: https://codereview.stackexchange.com/a/211511

import PlaintextLine from "./PlaintextLine";

export default function Plaintext({text}) {
  if (text==null) {
    return (<pre data-testid="plaintext-empty"></pre>)
  }
  const textToRender = typeof text === "string" ? text : JSON.stringify(text, null, 2);
  const [firstLine, ...rest] = textToRender.split('\n')
  return (
    <pre data-testid="plaintext">
      <span key={"span-0"}>{ firstLine }</span>
      {
        rest.map((line,index) => <PlaintextLine key={index+1} text={line} />)
      }
    </pre>
  );
}