DesignerApp.module("NodeCanvas.Controller", function(Controller, DesignerApp, Backbone, Marionette, $, _) {


    var viewNodeCanvas = Controller.viewNodeCanvas;


    var loadGist = function(gistId) {
        var github = hello("github");
        github.api('/gists/' + gistId, 'get', {random : Math.random()}).then(function(resp) {

            var first_key = resp.files[Object.keys(resp.files)[0]]; //returns 'someVal'

            if (first_key.filename) {
                gistloadedid = gistId;
                gistfilename = first_key.filename;
                var jsonfile = (JSON.parse(first_key.content));
                DesignerApp.NodeEntities.ClearNodeCanvas(DesignerApp.NodeEntities.getNodeCanvas());
                DesignerApp.NodeEntities.AddNodeCanvas(jsonfile);
            }
        });
    };


    var saveGist = function(fileName, description) {
        var json_post = {
            "description": description,
            "public": true,
            "files": {}
        };

        json_post.files[fileName] = {content: JSON.stringify(DesignerApp.NodeEntities.ExportToJSON())};

        var github = hello("github");
        github.api('/gists', 'post', json_post).then(function(resp) {
            console.log(resp);
        });

    };

    var updateGist = function(gistID) {
        var json_post = {
                          "description": "the description for this gist",
                          "files": {
                        }
                    };


        json_post.files[gistfilename] = {content: JSON.stringify(DesignerApp.NodeEntities.ExportToJSON())};

        var github = hello("github");
        github.api('/gists/' + gistID, 'patch', json_post).then(function(resp) {
            console.log(resp);
        });
    };

    viewNodeCanvas.on("canvas:addmap", function() {

      var data =  {
            classname:'asdsad',
            color:'White',
            increment:true,
            name:'asdsad',
            namespace:"",
            position: {x:300, y:300},
            softdelete:false,
            timestamp:true,    
            type:'maps'
        }

        var nodeCanvas = DesignerApp.NodeEntities.getNodeCanvas();
        nodeCanvas.add(data);

    });

    viewNodeCanvas.on("canvas:createcontainer", function() {

        var container = DesignerApp.NodeEntities.getNewTableContainer();
        //console.log(container);
        var view = new DesignerApp.NodeModule.Modal.CreateTableContainer({
            model: container
        });

        var modal = DesignerApp.NodeModule.Modal.CreateTestModal(view);

        view.on("okClicked", function(data) {

            if (data.classname === '') data.classname = data.name

            if (container.set(data, {
                validate: true
            })) {
                data.position = {
                    x: 100,
                    y: 100
                };
                console.log(data);
                DesignerApp.NodeEntities.AddNewNode(data);
            } else {
                view.trigger("formDataInvalid", container.validationError);
                modal.preventClose();
            }
        });

    });

    viewNodeCanvas.on("canvas:new", function() {
        MightyBits.newFile()
    });

    viewNodeCanvas.on("canvas:open", function() {
        MightyBits.open()
    });


    viewNodeCanvas.on("canvas:opengist", function() {
        if (!authenticated) {
            hello.login("github", {
                scope: "gist"
            });
        } else {



            var view = new DesignerApp.NodeModule.Modal.GistLoad({});
            view.listenTo(view, "okClicked", function(fileName) {
                loadGist(fileName);
            });

            var gists = [];

            hello("github").api('/gists', 'get', function(gist_list) {
                for (var gist in gist_list.data) {
                    

                    var gist_files = gist_list.data[gist].files[Object.keys(gist_list.data[gist].files)[0]]; //returns 'someVal'
                    //console.log(gist_files.filename);

                    if (gist_files.filename.split('.').pop() === "skema"){
                        var tmp = {};
                        tmp.id = (gist_list.data[gist].id);
                        tmp.description = (gist_list.data[gist].description);
                        tmp.date = (gist_list.data[gist].created_at);
                        tmp.filename = gist_files.filename;
                        gists.push(tmp);
                    }

                }
                view.trigger("listGistFiles", gists);
            });


            var modal = DesignerApp.NodeModule.Modal.CreateTestModal(view);
        }

    });

    viewNodeCanvas.on("canvas:opengistid", function() {
        var view = new DesignerApp.NodeModule.Modal.GistLoadId({});
        var modal = DesignerApp.NodeModule.Modal.CreateTestModal(view);
        view.listenTo(view, "okClicked", function(fileName) {
            loadGist(fileName);
            modal.preventClose();
        });
    });

    viewNodeCanvas.on("canvas:savecurrentgis", function() {
        updateGist(gistloadedid);
    });

    viewNodeCanvas.on("canvas:saveasgist", function() {
        var view = new DesignerApp.NodeModule.Modal.GistSaveAs({});
        var modal = DesignerApp.NodeModule.Modal.CreateTestModal(view);

        view.listenTo(view, "okClicked", function(data) {
            saveGist(data.filename + ".skema", data.description);
            modal.preventClose();
        });

    });

    viewNodeCanvas.on("canvas:save", function() {
        MightyBits.saveFile()
    });

    viewNodeCanvas.on("canvas:saveas", function() {
        MightyBits.saveAsFile()
    });

    viewNodeCanvas.on("canvas:loadexample", function() {
        MightyBits.loadExample()
    });

    viewNodeCanvas.on("canvas:clearcanvas", function() {
        MightyBits.clearCanvas()
    });

    viewNodeCanvas.on("canvas:generate", function() {
        // var view = new DesignerApp.NodeModule.Modal.Generate({
        //     content: DesignerApp.NodeEntities.GenerateCode()
        // });
        // var modal = DesignerApp.NodeModule.Modal.CreateTestModal(view);
        MightyBits.generatePlatformTo()
    });

});