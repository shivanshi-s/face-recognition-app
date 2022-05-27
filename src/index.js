const video = document.getElementById('video');

Promise.all([
   faceapi.nets.tinyFaceDetector.loadFromUri('/src/models/'),
   faceapi.nets.faceLandmark68Net.loadFromUri('/src/models/'),
   faceapi.nets.faceRecognitionNet.loadFromUri('/src/models/'),
   faceapi.nets.faceExpressionNet.loadFromUri('/src/models/')
 ]).then(startVideo());

function startVideo() {
   navigator.getUserMedia(
      {video : {} },
      stream => video.srcObject = stream,
      error => console.error(error)
   )
}


video.addEventListener('play', () => {
   const canvas = faceapi.createCanvasFromMedia(video)
   document.body.append(canvas)
   // canvas to be sized perfectly over our video
   const displaySize = { width : video.width, height : video.height }

   faceapi.matchDimensions(canvas, displaySize)

   setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video,
      new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
      // console.log(detections)
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      canvas.getContext('2d').clearRect(0,0,canvas.width, canvas.height)
      faceapi.draw.drawDetections(canvas, resizedDetections)

      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)

      faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
   }, 100)
})