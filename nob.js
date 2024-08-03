const screen = document.getElementById("screen")

screen.width = window.innerWidth
screen.height = window.innerHeight

const game = {
    "objects": [],

    "renderservice": {
        "draw": function (dframe) {
            //set shape to "image" or "img" for an image

            const ctx = screen.getContext("2d")

            if (dframe.shape === "rect" || dframe.shape === "rectangle") {
                ctx.fillStyle = dframe.color
                ctx.fillRect(dframe.frame.position.x, dframe.frame.position.y, dframe.frame.size.x, dframe.frame.size.y)
            }
        }
    },
    
    "object": {
        "new": function (type, texture, display, velocity, extra) {
            var data = { "type": type, "texture": texture, "display": display, "velocity": velocity, "data": extra }
            game.objects.push(data)

            return game.objects[game.objects.length - 1]
        }
    },

    "runservice": {
        "render": function (deltatime, object) {
            //defualt

            game.renderservice.draw(drawframe.new(displayframe.new(0, 0, 90, vector2.new(screen.width, screen.height)), "rect", "black"))

            const dframe = drawframe.new(object.display, object.texture.type, object.texture.texture)

            game.renderservice.draw(dframe)
        },

        "update": function (deltatime, object) {
            //defualt

            const frame = object.display
            const velocity = object.velocity.position

            if (object["code"]) {
                object["code"](deltatime)
            }

            frame.position.x += velocity.x
            frame.position.y += velocity.y
            frame.position.r += velocity.r
        },

        "frame": function () {
            const objects = game.objects

            for (obi = 0; obi < objects.length; obi++) {
                const object = objects[obi]

                game.runservice.update(1, object)
                game.runservice.render(1, object)
            }
        },

        "start": function (deltatime, ms) {
            setInterval(game.runservice.frame, ms)
        }
    },

    "getservice": function (name) {
        return game[name]
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