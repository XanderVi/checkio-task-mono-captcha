//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210'],
    function (ext, $, TableComponent) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide["in"] = data[0];
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            var checkioInput = data.in;

            if (data.error) {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.output').html(data.error.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
                return false;
            }

            var rightResult = data.ext["answer"];
            var userResult = data.out;
            var result = data.ext["result"];
            var result_addon = data.ext["result_addon"];


            //if you need additional info from tests (if exists)
            var explanation = data.ext["explanation"];

            $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult));

            if (!result) {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.answer').html('Right result:&nbsp;' + JSON.stringify(rightResult));
                $content.find('.answer').addClass('error');
                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
            }
            else {
                $content.find('.call').html('Pass: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.answer').remove();
            }

            var canvas = new CaptchaCanvas();
            canvas.create($content.find(".explanation")[0], checkioInput, explanation);


            this_e.setAnimationHeight($content.height() + 60);

        });

        var $tryit;
        var tCanvas;

        ext.set_console_process_ret(function (this_e, ret) {
            $tryit.find(".checkio-result").html("Result<br>" + ret);
        });

        ext.set_generate_animation_panel(function (this_e) {
            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit'))).find('.tryit-content');

            tCanvas = new CaptchaCanvas();
            var numb = Math.floor(Math.random() * 999);
            var image = tCanvas.generateImage(numb);
            tCanvas.create($tryit.find(".tryit-canvas")[0], image, "");
            tCanvas.feedback();

            $tryit.find('.bn-random').click(function(e) {
                numb = Math.floor(Math.random() * 999);
                image = tCanvas.generateImage(numb);
                tCanvas.remove();
                tCanvas.create($tryit.find(".tryit-canvas")[0], image, "");
                tCanvas.feedback();
                return false;
            });

            $tryit.find('.bn-check').click(function (e) {
                e.preventDefault();
                this_e.sendToConsoleCheckiO(tCanvas.gather());
                e.stopPropagation();
                return false;
            });
        });

        function CaptchaCanvas(options) {
            var colorOrange4 = "#F0801A";
            var colorOrange3 = "#FA8F00";
            var colorOrange2 = "#FAA600";
            var colorOrange1 = "#FABA00";

            var colorBlue4 = "#294270";
            var colorBlue3 = "#006CA9";
            var colorBlue2 = "#65A1CF";
            var colorBlue1 = "#8FC7ED";

            var colorGrey4 = "#737370";
            var colorGrey3 = "#9D9E9E";
            var colorGrey2 = "#C5C6C6";
            var colorGrey1 = "#EBEDED";

            var colorWhite = "#FFFFFF";

            options = options || {};

            var cell = options["cell"] || 18;
            var innerCell = cell * 2 / 3;
            var padding = cell / 6;

            var x0 = 10,
                y0 = 10;

            var root;
            var paper;
            var imageArray;

            var attrCell = {"stroke-width": 1, "stroke": colorGrey4};
            var attrFull = {"stroke-width": 1,"stroke": colorBlue4, "fill": colorBlue4};
            var attrFullWrong = {"stroke-width": 1, "stroke": colorBlue2, "fill": colorBlue2};
            var attrEmptyWrong = {"stroke-width": 1, "stroke": colorGrey2, "fill": colorGrey2};


            this.create = function (root, image, wrongs) {
                paper = Raphael(root, 2 * x0 + cell * image[0].length, 2 * y0 + cell * image.length);
                imageArray = [];
                for (var i = 0; i < image.length; i++) {
                    var row = [];
                    for (var j = 0; j < image[0].length; j++) {
                        var x = x0 + j * cell,
                            y = y0 + i * cell;
                        paper.rect(x, y, cell, cell).attr(attrCell);
                        var el = image[i][j];
                        var isRight = wrongs.indexOf(" " + i + "," + j + " ") === -1;
                        if (el === 1) {
                            var p = paper.rect(x + padding, y + padding, innerCell, innerCell).attr(
                                isRight ? attrFull : attrFullWrong);
                            row.push(p);
                        }
                        else if (el === 0) {
                            if (!isRight) {
                                p = paper.rect(x + padding, y + padding, innerCell, innerCell).attr(attrEmptyWrong);
                                row.push(p);
                            }
                            else {
                                row.push(false);
                            }
                        }
                    }
                    imageArray.push(row);
                }
            };

            this.feedback = function() {
                var activEl = paper.rect(x0, y0, cell * imageArray[0].length, cell * imageArray.length).attr(
                    {"stroke-width": 0, "fill": colorWhite, "fill-opacity": 0});
                activEl.click(function(e){
                    var offX = e.offsetX;
                    var offY = e.offsetY;
                    if (typeof offX === "undefined" || typeof offY === "undefined") {
                        var targetOffset = $(e.target).offset();
                        offX = e.pageX - targetOffset.left;
                        offY = e.pageY - targetOffset.top;
                    }
                    var col = Math.floor((offX - x0) / cell);
                    var row = Math.floor((offY - y0) / cell);
                    if (imageArray[row][col]) {
                        imageArray[row][col].remove();
                        imageArray[row][col] = false;
                    }
                    else {
                        imageArray[row][col] = paper.rect(
                            col * cell + padding + x0, y0 + row * cell + padding, innerCell, innerCell).attr(attrFull);
                    }
                    activEl.toFront();
                });
            };

            this.gather = function() {
                var image = [];
                for (var i = 0; i < imageArray.length; i++) {
                    image.push([]);
                    for (var j = 0; j < imageArray[0].length; j++) {
                        image[i][j] = imageArray[i][j] ? 1 : 0;
                    }
                }
                return image;
            };

            this.remove = function () {
                paper.remove();
            };

            var digits = [
                [
                    [0, 0, 0, 0, 0],
                    [1, 1, 1, 1, 0],
                    [1, 0, 0, 0, 1],
                    [0, 1, 1, 1, 1]
                ],
                [
                    [0, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0],
                    [1, 1, 1, 1, 1],
                    [0, 0, 0, 0, 0]
                ],
                [
                    [0, 0, 0, 0, 0],
                    [1, 0, 0, 1, 1],
                    [1, 0, 1, 0, 1],
                    [1, 1, 1, 0, 1]
                ],
                [
                    [0, 0, 0, 0, 0],
                    [1, 0, 0, 0, 1],
                    [1, 0, 1, 0, 1],
                    [1, 1, 0, 1, 1]
                ],
                [
                    [0, 0, 0, 0, 0],
                    [1, 1, 1, 0, 0],
                    [0, 0, 1, 0, 0],
                    [1, 1, 1, 1, 1]
                ],
                [
                    [0, 0, 0, 0, 0],
                    [1, 1, 1, 0, 1],
                    [1, 0, 1, 0, 1],
                    [1, 0, 0, 1, 0]
                ],
                [
                    [0, 0, 0, 0, 0],
                    [0, 1, 1, 1, 0],
                    [1, 0, 1, 0, 1],
                    [1, 0, 1, 1, 1]
                ],
                [
                    [0, 0, 0, 0, 0],
                    [1, 0, 0, 1, 1],
                    [1, 0, 1, 0, 0],
                    [1, 1, 0, 0, 0]
                ],
                [
                    [0, 0, 0, 0, 0],
                    [1, 1, 1, 1, 1],
                    [1, 0, 1, 0, 1],
                    [1, 1, 1, 1, 1]
                ],
                [
                    [0, 0, 0, 0, 0],
                    [0, 1, 1, 0, 1],
                    [1, 0, 1, 0, 1],
                    [1, 1, 1, 1, 0]
                ]
            ];


            this.generateImage = function (numb) {
                numb = String(numb);
                var res = [];
                for (var i = 0; i < numb.length; i++) {
                    var d = Number(numb[i]);
                    for (var j = 0; j < digits[d].length; j++) {
                        res.push(digits[d][j].slice());
                    }
                }
                res.push([0, 0, 0, 0, 0]);
                var image = [];
                for (i = 0; i < res[0].length; i++) {
                    image.push([]);
                    for (j = 0; j < res.length; j++) {
                        image[i][j] = res[j][i];
                    }
                }
                return image;

            };


        }


    }
);
