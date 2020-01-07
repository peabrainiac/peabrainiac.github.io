export default class BetterImageData extends ImageData {

    blur(radiusOrRadiusArray){
        if (radiusOrRadiusArray instanceof Uint8Array){
            var data = this.data;
            var oldData = new Uint8ClampedArray(this.data);
            var kernels = [];
            for (let i=0;i<16;i++){
                kernels.push(createGaussianKernel(6*i+1,2*i));
            }
            for (let x=0,w=this.width;x<w;x++){
                for (let y=0,h=this.height;y<h;y++){
                    let sumR = 0;
                    let sumG = 0;
                    let sumB = 0;
                    let sumA = 0;
                    let radius = Math.min(15,radiusOrRadiusArray[x+y*w]);
                    let kernelOffset = 3*radius;
                    let kernel = kernels[radius];
                    for (let x2=Math.max(x-kernelOffset,0);x2<Math.min(x+kernelOffset+1,w);x2++){
                        for (let y2=Math.max(y-kernelOffset,0);y2<Math.min(y+kernelOffset+1,h);y2++){
                            let kernelValue = kernel[x2+kernelOffset-x]*kernel[y2+kernelOffset-y];
                            let i = (x2+y2*w)*4;
                            sumR += oldData[i]*kernelValue;
                            sumG += oldData[i+1]*kernelValue;
                            sumB += oldData[i+2]*kernelValue;
                            sumA += oldData[i+3]*kernelValue;
                        }
                    }
                    let i = (x+y*w)*4;
                    data[i] = sumR;
                    data[i+1] = sumG;
                    data[i+2] = sumB;
                    data[i+3] = sumA;
                }
            }
        }else if (!isNaN(radiusOrRadiusArray)){
            if (radiusOrRadiusArray>0){
                var data = this.data;
                var tempData = new Uint8ClampedArray(this.data);
                let radius = radiusOrRadiusArray;
                let kernelSize = Math.round(3*radius)*2+1;
                let kernelOffset = (kernelSize-1)/2;
                let kernel = createGaussianKernel(kernelSize,radius);
                for (let x=0,w=this.width;x<w;x++){
                    for (let y=0,h=this.height;y<h;y++){
                        let sumR = 0;
                        let sumG = 0;
                        let sumB = 0;
                        let sumA = 0;
                        for (let x2=Math.max(x-kernelOffset,0);x2<Math.min(x+kernelOffset+1,w);x2++){
                            let kernelValue = kernel[x2+kernelOffset-x];
                            let i = (x2+y*w)*4;
                            sumR += data[i]*kernelValue;
                            sumG += data[i+1]*kernelValue;
                            sumB += data[i+2]*kernelValue;
                            sumA += data[i+3]*kernelValue;
                        }
                        let i = (x+y*w)*4;
                        tempData[i] = sumR;
                        tempData[i+1] = sumG;
                        tempData[i+2] = sumB;
                        tempData[i+3] = sumA;
                    }
                }
                for (let x=0,w=this.width;x<w;x++){
                    for (let y=0,h=this.height;y<h;y++){
                        let sumR = 0;
                        let sumG = 0;
                        let sumB = 0;
                        let sumA = 0;
                        for (let y2=Math.max(y-kernelOffset,0);y2<Math.min(y+kernelOffset+1,h);y2++){
                            let kernelValue = kernel[y2+kernelOffset-y];
                            let i = (x+y2*w)*4;
                            sumR += tempData[i]*kernelValue;
                            sumG += tempData[i+1]*kernelValue;
                            sumB += tempData[i+2]*kernelValue;
                            sumA += tempData[i+3]*kernelValue;
                        }
                        let i = (x+y*w)*4;
                        data[i] = sumR;
                        data[i+1] = sumG;
                        data[i+2] = sumB;
                        data[i+3] = sumA;
                    }
                }
            }
        }else{
            throw new Error("Invalid Argument: radiusOrRadiusArray must be a number or an Uint8Array!");
        }
    }
}
function createGaussianKernel(width,sigma){
    var kernel = new Float32Array(width);
    if (width==1){
        kernel[0] = 1;
    }else{
        let mean = (width-1)/2;
        let sum = 0;
        for (let i=0;i<width;i++){
            kernel[i] = Math.exp(-0.5*((i-mean)/sigma)*((i-mean)/sigma))/(2*Math.PI*sigma*sigma);
            sum += kernel[i];
        }
        for (let i=0;i<width;i++){
            kernel[i] /= sum;
        }
    }
    return kernel;
}
window.BetterImageData = BetterImageData;