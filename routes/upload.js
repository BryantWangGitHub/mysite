exports.upload = function (req, res) {  
        console.log("文件传输"+req.files.file);  
            var patharray = req.files.file.path.split("\\");  
                res.send(patharray[patharray.length-1]);  
}  

