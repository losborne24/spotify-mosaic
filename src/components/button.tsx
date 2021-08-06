const Button = (props: any) => {
  return (
    <>
      <button onClick={props.onClick}>{props.name}</button>
    </>
  );
};
export default Button;
