import React from 'react'
import Image from 'next/image'
import Slider from 'react-slick';
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io';


interface Props {
    data: any,
}

const newsSliderImageLoader = ({ src }) => {
    return `${src}?width=512`
}

export default function NewsSlider({ data }: Props) {

    const settings = {
        className: "",
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: <NewsPrevArrow />,
        nextArrow: <NewsNextArrow />,
    };

    function NewsPrevArrow(props) {
        const { className, style, onClick } = props;
    
        return (
          <div onClick={onClick} className={`${onClick === null ? "hidden" : "cursor-pointer z-10"} absolute text-brand-grey-120 dark:text-white font-extrabold top-20 left-5 cursor-pointer`}>
            <IoIosArrowDropleft size={28} />
          </div>
        );
    }
    
    function NewsNextArrow(props) {
        const { className, style, onClick } = props;
    
        return (
          <div onClick={onClick} className={`${onClick === null ? "hidden" : "cursor-pointer z-10"} absolute text-brand-grey-120 dark:text-white font-extrabold top-20 right-5 cursor-pointer`}>
            <IoIosArrowDropright size={28} />
          </div>
        );
    }
    
    return (
        <Slider {...settings}>
            {data.map((item, index) => (
                <a href={`/news/${item.slug}`} key={index} className="flex flex-col space-y-2">
                    <div style={{ height: "12rem" }} className="relative w-11/12 mx-auto">
                    {item.image && (
                        <Image className="rounded-md" priority={index == 0} layout="fill" objectFit="fill" src={`${item.image}`} loader={newsSliderImageLoader} />
                    )}
                    </div>
                    <div className="flex flex-col items-start w-11/12 mx-auto text-sm">
                        <p className="font-semibold">{item.title}</p>
                    </div>
                </a>
            ))}
        </Slider>
    )
}