import Link from "next/link";

const Button = ({ btnUrl = "/", btnText, variant, btnIcons }) => {
  return (
    <>
      <Link href={btnUrl} className={variant}>
        <span>{btnText}</span>
        {btnIcons && <i>{btnIcons}</i>}
      </Link>
    </>
  );
};

export default Button;
