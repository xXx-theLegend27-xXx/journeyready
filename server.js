const http = require("http");
const fs = require("fs");
const url = require('url');

function endNotFound(response) {
    response.writeHead(404, {
        'Content-Type': 'text/html'
    });
    response.end("404 Not Found");
}

function handleRequest(request, response) {
    let query = url.parse(request.url, true);
    if (query.pathname == "/") {
        query.pathname = "/index.html";
    }

    // Only allow public files
    let fileDir = query.pathname.split("/");
    // must start with "public."
    fileDir[fileDir.length - 1] = "public." + fileDir[fileDir.length - 1];
    // join back to query.pathname
    query.pathname = fileDir.join("/")

    let fileName = "." + query.pathname;

    fs.readFile(fileName, (err, fileData) => {
        if (err) {
            return endNotFound(response);
        } else {
            // Find file extension
            let extensions = fileDir[fileDir.length - 1].split(".").slice(1);
            let extension = extensions[extensions.length - 1];
            // Check for content type

            if (extension == "html" || extension == "htm") {
                response.writeHead(200, {
                    "Content-Type": "text/html"
                });
            }

            if (extension == "css") {
                response.writeHead(200, {
                    "Content-Type": "text/css"
                });
            }

            if (extension == "js") {
                response.writeHead(200, {
                    "Content-Type": "text/javascript"
                });
            }

            if (extension == "gif") {
                response.writeHead(200, {
                    "Content-Type": "image/gif"
                });
            }

            if (extension == "jpg" || extension == "jpeg") {
                response.writeHead(200, {
                    "Content-Type": "image/jpeg"
                });
            }

            if (extension == "png") {
                response.writeHead(200, {
                    "Content-Type": "image/png"
                });
            }

            if (extension == "tiff") {
                response.writeHead(200, {
                    "Content-Type": "image/tiff"
                });
            }

            if (extension == "ico") {
                response.writeHead(200, {
                    "Content-Type": "image/x-icon"
                });
            }

            if (extension == "woff2") {
                response.writeHead(200, {
                    "Content-Type": "font/woff2"
                });
            }

            if (extension == "svg") {
                response.writeHead(200, {
                    "Content-Type": "image/svg+xml"
                });
            }

            // Return with the data
            response.end(fileData);
        }
    });
}

var server = http.createServer(handleRequest);
server.listen(80);
console.log("Server is listening")