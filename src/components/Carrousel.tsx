import { useState, useEffect } from "react";
import "./Carrousel.css";

interface CarouselItem {
    src: string;
    alt: string;
}
interface CarouselProps {
    images: CarouselItem[];
}

export const Carousel = ({ images } : CarouselProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div id="carousel">
            {images.map((image, index) => (
                <img
                className="slide fade"
                style={{ display: currentSlide === index ? "block" : "none" }}
                src={image.src}
                alt={image.alt}
                />
            ))}
        </div>
    );
};
