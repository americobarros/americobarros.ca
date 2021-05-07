"use strict";
//Args
//id: "divID", prefix: "example_files/me_waving/waving", type: "jpg", start: "0", end: "0060"

/*
Optional args:
- padZeros: number of zeros to pad in file numbering Default:0
- stopPos: 'top', 'bottom', 'middle' determines where the canvas should be in the viewport
	when the last frame of the squence is shown. Default: middle
*/
function ScrollSomeMore(args) {

	// Code below adapted from https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/
	const html = document.documentElement;
	const wrapper = document.getElementById(args.id);
	const canvas = document.createElement("canvas");
	wrapper.append(canvas);
	const context = canvas.getContext("2d");

	args.padZeros = (args.padZeros == null ? 0 : args.padZeros);
	if(args.stopPos === 'top') args.stopPos = 1;
	else if(args.stopPos === 'bottom') args.stopPos = 0;
	else args.stopPos = 0.5;


	const frameCount = args.end-args.start;
	const currentFrame = index => (
		`${args.prefix}${index.toString().padStart(args.padZeros, '0')}.${args.type}`
	)

	const preloadImages = () => {
		for (let i = 1; i <= frameCount; i++) {
			const img = new Image();
			img.src = currentFrame(i);
		}
	};

	//Use one of the images to set the canvas height
	const img_canvas = new Image()
	img_canvas.src = currentFrame(0);
	img_canvas.onload=function(){
		canvas.width=img_canvas.width;
		canvas.height=img_canvas.height;
		canvas.style.top = "calc(50% - " + canvas.clientHeight / 2  + "px )";
	}

	const img = new Image()
	img.src = currentFrame(1);
	img.onload=function(){
		context.drawImage(img, 0, 0); // destination rectangle
	}

	const updateImage = index => {
		img.src = currentFrame(index);
		context.drawImage(img, 0, 0);
	}

	window.addEventListener('scroll', () => {  
		//ScrollPos is current viewports scroll position on the page
		const scrollPos = html.scrollTop;

		//Get info about the wrappers position along the scroll and
		//how logn it is in the viewport
		const wrapperPos = wrapper.offsetTop;
		const wrapperHeight = wrapper.scrollHeight;

		//The animation should complete when the canvas reaches either the
		//top, bottom, or middle of the page
		const maxScrollPos = wrapperHeight - window.innerHeight * args.stopPos;

		//At what point along the animation have you scrolled to
		const wrapperStart = (wrapperPos - window.innerHeight >= window.innerHeight ? wrapperPos - window.innerHeight*args.stopPos: wrapperPos);
		const scrollFraction = Math.max(scrollPos - wrapperStart, 0) / maxScrollPos;
		const frameIndex = Math.min(
			frameCount - 1,
			Math.ceil(scrollFraction * frameCount)
		);
		
		requestAnimationFrame(() => updateImage(frameIndex + 1));
	});

	preloadImages();
	canvas.style.position = "sticky";
	canvas.style.width = "inherit";
}


/*
Some Ideas:
    scroll - the main one, just play the animation starting from when the element is at the bottom and ending when the element is at the top
    scroll stop scroll - basically start an animation when it enters the page up to a certain frame, then pause to let it finish in
        the midddle of the page and continue scrolling
    scoll and play - start the animation as soon as the bject appears on the screen at certain frame rate

    add options like:
        noRewind - the animaiton will not rewind if the user scrolls back up
        addControls - adds controls to videos
        loop - for the scroll and play option
        endImage - replace with a (possibly high quality) image once the animation has completed, must be same aspect ratio for seamlessness, ideally is  HQ version of the last frame
         

    enable for both photo and video?


Implementation
posibly using sections or maybe an image things with a class of "ScrollSomeMore" and then an extra tag like "end_number" for like the
last image,
or look at graphics libraries and see hwo those are called and used in html becasue i am confusion
    */