import Image from "next/image";

const CounterSection = ({ data }) => {
  return (
    <div className="container">
      <div className="cs_counter_content cs_blue_bg">
        <div className="cs_counter_shape position-absolute">
        <Image src="/assets/img/counter_shape.png" alt="img" width={1296} height={196}   />
        </div>
        <div className="cs_counter_1_wrap">
          {data.map((counter, index) => (
            <div className="cs_counter cs_style_1" key={index}>
              <div className="cs_counter_icon cs_center">
              <Image src={counter.iconUrl} alt="img" width={37} height={37}   />
              </div>
              <div className="cs_counter_nmber">{counter.number}</div>
              <p className="cs_counter_title mb-0">{counter.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CounterSection;
