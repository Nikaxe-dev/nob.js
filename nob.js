const body = document.body

const screen = document.getElementById("screen")
const loadedimages = document.createElement("div")
loadedimages.style.display = "none"
loadedimages.id = "loadedimages"

body.appendChild(loadedimages)

screen.width = window.innerWidth
screen.height = window.innerHeight

const auto = "auto"

Math.dirtovel = function (xv, yv) {
    return (Math.atan2(yv, xv) / Math.PI) * 180
}

const computedata = {
    "objectservice": {
        "findbyid": {

        }
    },

    "renderservice": {
        "imagedata": {
            "loaded": [

            ]
        }
    }
}

const displayframe = {
    "new": function (x, y, r, size) {
        return {
            "position": {
                "x": x,
                "y": y,
                "r": r
            },

            "size": size
        }
    }
}

const drawframe = {
    "new": function (displayframe, shape, color) {
        return { "frame": displayframe, "shape": shape, "color": color }
        //set color to image link for images
    }
}

const texturedata = {
    "new": function (texture, texturetype) {
        return {"texture": texture, "type": texturetype}
    }
}

const vector2 = {
    "new": function (x, y) {
        return {"x":x, "y":y}
    }
}

const vector3 = {
    "new": function (x, y, z) {
        return {"x":x, "y":y, "z":z}
    }
}

const game = {
    "objects": {
        "children": [

        ],

        "deletebyid": function (id) {
            game.objects.children.splice(game.objects.findbyid(id, "obi"), 1)
        },

        "new": function (id, type, texture, display, velocity, extra, tags) {
            var data = {
                "id": id,
                "type": type,
                "texture": texture,
                "display": display,
                "velocity": velocity,
                "data": extra,
                "tags": tags,

                "pointtowards": function (x, y) {
                    const position = data.display.position
                    position.r = Math.dirtovel(x - position.x, y - position.y)
                    return position.r
                },

                "pointwithvelocity": function (xv, yv) {
                    const position = data.display.position
                    data.pointtowards(position.x + xv, position.y + yv)
                    return position.r
                },

                "destroy": function () {
                    game.objects.deletebyid(id)
                },

                "delete": function () {
                    game.objects.deletebyid(id)
                }
            }
            
            game.objects.children.push(data)

            return game.objects.children[game.objects.length - 1]
        },

        "findbyid": function (id, returntype) {
            if (computedata.objectservice.findbyid[id] && returntype === undefined) {
                return computedata.objectservice.findbyid[id]
            }

            const allobjects = game.objects.children

            for (obi = 0; obi < allobjects.length; obi++) {
                const object = allobjects[obi]

                if (object.id === id) {
                    if (returntype === undefined) { computedata.objectservice.findbyid[object.id] = object }

                    if (returntype === "obi") { return obi } else if (returntype === undefined) { return object }
                }
            }

            return null
        }
    },

    "inputservice": {
        "started": false,

        "keyboard": {

        },

        "mouse": {
            "position": vector2.new(0, 0),

            "trueposition": vector2.new(0, 0),

            "input": {
                "buttononedown": false,
                "buttontwodown": false
            }
        },

        "startlisten": function () {
            if (!game.inputservice.started) {
                window.addEventListener('keydown', function (e) {
                    game.inputservice.keyboard[e.key.toLowerCase()] = true
                }, true);
            
                window.addEventListener('keyup', function (e) {
                    game.inputservice.keyboard[e.key.toLowerCase()] = false
                }, true);

                addEventListener("mousedown", function (e) {
                    game.inputservice.mouse.buttononedown = true
                })
            
                addEventListener("mouseup", function (e) {
                    game.inputservice.mouse.buttononedown = false
                })

                document.body.onmousemove = function (e) {
                    game.inputservice.mouse.position = vector2.new(e.clientX, e.clientY)
                }

                game.inputservice.started = true
            }
        }
    },

    "renderservice": {
        "image": {
            "load": function (src) {
                const img = document.createElement("img")
                img.src = src
                img.class = "loadedimage"
                loadedimages.appendChild(img)

                computedata.renderservice.imagedata.loaded[src] = img

                return img
            }
        },

        "draw": function (dframe) {
            //set shape to "image" or "img" for an image

            const ctx = screen.getContext("2d")
            ctx.translate(dframe.frame.position.x - game.objects.findbyid("camera").display.position.x, dframe.frame.position.y - game.objects.findbyid("camera").display.position.y)
            ctx.rotate(dframe.frame.position.r * Math.PI / 180)

            if (dframe.shape === "rect" || dframe.shape === "rectangle") {
                ctx.fillStyle = dframe.color

                ctx.fillRect(0, 0, dframe.frame.size.x, dframe.frame.size.y)
            }

            if (dframe.shape === "img" || dframe.shape === "image") {
                if (!computedata.renderservice.imagedata.loaded[dframe.color]) {
                    game.renderservice.image.load(dframe.color)
                }

                const img = computedata.renderservice.imagedata.loaded[dframe.color]

                ctx.fillStyle = dframe.color

                ctx.drawImage(img, -dframe.frame.size.x / 2, -dframe.frame.size.x / 2, dframe.frame.size.x, dframe.frame.size.y)
            }

            ctx.rotate(-dframe.frame.position.r * Math.PI / 180)
        }
    },

    "runservice": {
        "render": function (deltatime, object) {
            //defualt

            const dframe = drawframe.new(object.display, object.texture.type, object.texture.texture)

            game.renderservice.draw(dframe)
        },

        "type": {
            //Add a script that only executes for one type

            /*
            "testobject101": function(deltatime, object) {
                console.log("Hello, World!")
            }
            */
        },

        "tag": {
            //Add a script that only executes for objects with one tag

            /*
            "log": function(deltatime, object) {
                console.log("Hello, World!")
            }
            */
        },

        "update": function (deltatime, object) {
            //defualt

            const frame = object.display
            const velocity = object.velocity.position

            if (object["script"]) {
                object["script"](deltatime)
            }

            if (game.runservice.type[object.type]) {
                game.runservice.type[object.type](deltatime, object, object.display.position, object.velocity.position)
            }

            if (object.tags) {
                for (tagi = 0; tagi < object.tags.length; tagi++) {
                    if (game.runservice.tag[object.tags[tagi]]) {
                        game.runservice.tag[object.tags[tagi]](deltatime, object, object.display.position, object.velocity.position)
                    }
                }
            }

            frame.position.x += velocity.x
            frame.position.y += velocity.y
            frame.position.r += velocity.r

            if (frame.position.r > 360) {
                frame.position.r -= 360
            }
        },

        "customframe": function (deltatime) {
            //function for easier editing of the framework
        },

        "frame": function () {
            screen.width = window.innerWidth
            screen.height = window.innerHeight

            game.inputservice.mouse.trueposition = vector2.new(game.inputservice.mouse.position.x + game.objects.findbyid("camera").display.position.x, game.inputservice.mouse.position.y + game.objects.findbyid("camera").display.position.y)

            const allobjects = game.objects.children

            game.runservice.customframe(1)

            game.renderservice.draw(drawframe.new(displayframe.new(game.objects.findbyid("camera").display.position.x, game.objects.findbyid("camera").display.position.y, 0, vector2.new(screen.width, screen.height)), "rect", "black"))

            for (obi = 0; obi < allobjects.length; obi++) {
                const object = allobjects[obi]

                game.runservice.update(1, object)
            }

            for (obi = 0; obi < allobjects.length; obi++) {
                const object = allobjects[obi]

                game.runservice.render(1, object)
            }
        },

        "start": function (deltatime, ms) {
            game.objects.new(
                "camera",
                "camera",
                texturedata.new(),
                displayframe.new(0, 0, 0, vector2.new(screen.width, screen.height)),
                displayframe.new(0, 0, 0),
                {}
            )

            game.inputservice.startlisten()
            setInterval(game.runservice.frame, ms)
        }
    },

    "getservice": function (name) {
        return game[name]
    }
}