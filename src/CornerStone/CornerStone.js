import React from "react";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneMath from "cornerstone-math"
import * as cornerstoneWadoImageLoader from "cornerstone-wado-image-loader"
import Hammer from "hammerjs";
import dicomParser from "dicom-parser"
import "./cornerStone.css"

cornerstoneWadoImageLoader.external.cornerstone = cornerstone
cornerstoneWadoImageLoader.external.dicomParser = dicomParser
cornerstoneTools.external.cornerstone = cornerstone
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath
cornerstoneTools.init();
class CornerstoneElement extends React.Component {
    constructor(){
        super()
        this.angleButton = React.createRef()
    }

    handleFileChange(e){
        const imageId = cornerstoneWadoImageLoader.wadouri.fileManager.add(e.target.files[0])
        this.loadImage(imageId)
    }

    loadImage(imageId){
        let el = this.element;
        el.onclick = function(e){
            document.oncontextmenu = function() {
                e.returnValue = false;
            }
        }
        cornerstone.enable(el)
        cornerstone.loadImage(imageId).then((image)=>{
            const viewport = cornerstone.getDefaultViewportForImage(el, image);
            cornerstone.displayImage(el, image, viewport)
        })
    }

    componentDidMount(){
        console.log(cornerstoneTools)
        window.addEventListener("contextmenu", function(){
            window.event.returnValue = false;  
            return false
        })
    }

    componentWillUnmount(){
        window.removeEventListener("contextmenu")
    }

    angleOn(){
        const AngleTool = cornerstoneTools.AngleTool;
        cornerstoneTools.addTool(AngleTool)
        cornerstoneTools.setToolActive('Angle', { mouseButtonMask: 1 })
    }

    lengthOn(){
        const LengthTool = cornerstoneTools.LengthTool;
        cornerstoneTools.addTool(LengthTool)
        cornerstoneTools.setToolActive("Length", {mouseButtonMask: 1})
    }

    eraserOn(){
        const EraserTool = cornerstoneTools.EraserTool;
        cornerstoneTools.addTool(EraserTool);
        cornerstoneTools.setToolActive("Eraser", {mouseButtonMask: 1})
    }

    render() {
        return (
            <div>
                <input type="file" onChange={(e)=>{this.handleFileChange(e)}}/>
                <button onClick={()=>{this.angleOn()}}>角度</button>&nbsp;&nbsp;
                <button onClick={()=>{this.lengthOn()}}>长度</button>&nbsp;&nbsp;
                <button onClick={()=>{this.eraserOn()}}>橡皮</button>
                <div
                    className="viewportElement"
                    ref={input => {
                        this.element = input;
                    }}
                >
                </div>
            </div>
        );
    }
}

export default CornerstoneElement