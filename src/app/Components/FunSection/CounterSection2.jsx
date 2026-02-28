import Image from "next/image";

const CounterSection2 = ({ data }) => {
  return (
    <>
      <div className="container">
        <div className="cs_counter_2_wrap">
          {data.map((item, index) => (
            <div className="cs_counter cs_style_2" key={index}>
              <div className="cs_counter_icon cs_center">
              <Image src={item.iconSrc} alt="img" width={37} height={37}   />
              </div>
              <div className="cs_counter_nmber">
                {item.countTo}
                {item.suffix}
              </div>
              <p className="cs_counter_title mb-0">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CounterSection2;
