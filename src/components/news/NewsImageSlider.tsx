"use client";

import { useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import { BACKEND_DOMAIN } from '@/api/config';

type AdditionalImage = {
  url: string;
  alt: string;
  order: number;
};

interface ClassNames {
  imageSlider: string;
  sliderContainer: string;
  slideItem: string;
  sliderControls: string;
  prevBtn: string;
  nextBtn: string;
  sliderDots: string;
  dot: string;
}

interface NewsImageSliderProps {
  title: string;
  mainImage: string;
  additionalImages?: AdditionalImage[];
  classNames: ClassNames;
}

export default function NewsImageSlider({ title, mainImage, additionalImages = [], classNames }: NewsImageSliderProps) {
	const resolveSrc = (src: string) => (src.startsWith('/images') ? src : `${BACKEND_DOMAIN}${src}`);

	const orderedImages = useMemo(() => ([
		{ url: mainImage, alt: title, isMain: true, width: 1200, height: 630 },
		...additionalImages
			.slice()
			.sort((a, b) => a.order - b.order)
			.map((img) => ({ url: img.url, alt: img.alt || title, isMain: false, width: 1200, height: 800 })),
	]), [mainImage, additionalImages, title]);

	const [currentIndex, setCurrentIndex] = useState(0);

	const handlePrev = () => {
		setCurrentIndex((prev) => (prev - 1 + orderedImages.length) % orderedImages.length);
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % orderedImages.length);
	};

	const handleDotClick = (idx: number) => {
		setCurrentIndex(idx);
	};

	const active = orderedImages[currentIndex];

	return (
		<div>
			<div className={classNames.imageSlider}>
				<div className={classNames.sliderContainer}>
					<div className={classNames.slideItem}>
						<Image
							src={resolveSrc(active.url)}
							alt={active.alt}
							width={active.width}
							height={active.height}
							className="img-fluid"
							style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
						/>
					</div>
				</div>
				<div className={classNames.sliderControls}>
					<button className={classNames.prevBtn} onClick={handlePrev}>
						<i className="fas fa-chevron-left"></i>
					</button>
					<button className={classNames.nextBtn} onClick={handleNext}>
						<i className="fas fa-chevron-right"></i>
					</button>
				</div>
				<div className={classNames.sliderDots}>
					{orderedImages.map((_, idx) => (
						<button key={idx} className={classNames.dot} onClick={() => handleDotClick(idx)} />
					))}
				</div>
			</div>
		</div>
	);
}


