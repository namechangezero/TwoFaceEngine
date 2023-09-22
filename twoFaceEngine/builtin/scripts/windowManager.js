
(function(){

    window.addEventListener("resize", () => {
        canvas_size = {"x":window.innerWidth - 20, "y":window.innerHeight - 20}
        
        canvas.width = canvas_size.x
        canvas.height = canvas_size.y
    })

})()
