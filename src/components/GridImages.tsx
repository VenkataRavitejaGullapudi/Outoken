import React from 'react';
import "./GridImages.css";

const defaultImgsLength = 11;
import { Link } from "react-router-dom";



const GridImages = () => {
    let listOfImages = getImages();
    return (
        <div className='gallery'>{listOfImages}</div>
    )
}

export default GridImages




function getImages() {
    let listOfImages = [];
    for (let i = 0; i < defaultImgsLength; i++) {
        let srcImg = `${document.location.origin}/assets/default_imgs/${i + 1}.png`
        listOfImages.push(
            <Link  key={srcImg}  to={`/minter/?imageUrl=${srcImg}`}><div className='imgDiv'>
                <img  src={srcImg} alt="info"></img>
            </div></Link>
        )
    }
    return listOfImages;
}