window.onload = function(){
    let view = "macroView";
    //    Canvas for the periodic table
    let c = document.getElementById("PT");
    let ctx = c.getContext("2d");

    //    Canvas for the centre screen
    let mainC = document.getElementById("main");
    let mainCtx = mainC.getContext("2d");
    let recentReactions = [];

    var selectedCompound = 0;

    var nucleusImage = document.createElement("img");
    nucleusImage.src = "Resources/Nucleus.png";

    var electronImage = document.createElement("img");
    electronImage.src = "Resources/Electrons.png";

    var sharedElectronImage = document.createElement("img");
    sharedElectronImage.src = "Resources/Shared Electron.png";
    //  Draws nucleus function
    function drawNucleus(nucleusX, nucleusY)
    {

    //        ctx.arc(nucleusX - 30, nucleusY, 30, 0, Math.PI * 2);
    //        nucleusImage.style.left = nucleusX + "px";
    //        nucleusImage.style.top = nucleusY + "px";
    //        nucleusImage.style.zIndex = 1000;
        mainCtx.drawImage(nucleusImage, nucleusX, nucleusY)

    }
    //  Designates electron pairing each with the function to update its position & draw
    class electronPair
    {
        constructor(centreX, centreY, horizontal, pairNo, share)
        {
            this.centreX = centreX;
            this.centreY = centreY;
            this.horizontal = horizontal;
            switch (pairNo)
            {
                case 1:
                    this.x = 10;
                    this.y = 0;
                    break;
                case 2:
                    this.x = 5;
                    this.y = Math.sqrt(25 * 25 - 6.25 * this.x * this.x);
                    break;
                case 3:
                    this.x = 0;
                    this.y = Math.sqrt(25 * 25 - 6.25 * this.x * this.x);
            }
            this.dx = 0.5;
            this.dy = 1;
            this.share = share;
            this.radius = 5;

        }

        updatePosition()
        {
            this.x -= this.dx;
            this.y = Math.sqrt(25 * 25 - 6.25 * this.x * this.x);
            this.y *= this.dy;

            if (this.x <= -10)
            {
                this.dx = -0.5;
                this.dy = -1;
            } else if (this.x >= 10)
            {
                this.dx = 0.5;
                this.dy = 1;
            }
        }

        drawElectron()
        {
            if (this.horizontal)
            {
                if (this.share)
                {
                    mainCtx.beginPath();
                    mainCtx.drawImage(sharedElectronImage, main.width / 2 - this.y - this.radius - this.centreX, main.height / 2 - this.radius - this.x - this.centreY);
                    mainCtx.drawImage(sharedElectronImage, main.width / 2 + this.y - this.radius - this.centreX, main.height / 2 - this.radius + this.x - this.centreY);
                    mainCtx.fill();
                    mainCtx.closePath();
                } else
                {
                    mainCtx.beginPath();
                    mainCtx.drawImage(electronImage, main.width / 2 - this.radius - this.y - this.centreX, main.height / 2 - this.radius - this.x - this.centreY);
                    mainCtx.drawImage(electronImage, main.width / 2 - this.radius + this.y - this.centreX, main.height / 2 - this.radius + this.x - this.centreY);
                    mainCtx.fill();
                    mainCtx.closePath();
                }
            } else
            {
                if (this.share)
                {
                    mainCtx.beginPath();
                    mainCtx.drawImage(sharedElectronImage, main.width / 2 - this.x - this.radius - this.centreX, main.height / 2 - this.radius + this.y);
                    mainCtx.drawImage(sharedElectronImage, main.width / 2 + this.x - this.radius - this.centreX, main.height / 2 - this.radius - this.y);
                    mainCtx.fill();
                    mainCtx.closePath();
                } else
                {
                    mainCtx.beginPath();
                    mainCtx.drawImage(electronImage, main.width / 2 - this.radius - this.x - this.centreX, main.height / 2 - this.radius + this.y);
                    mainCtx.drawImage(electronImage, main.width / 2 - this.radius + this.x - this.centreX, main.height / 2 - this.radius - this.y);
                    mainCtx.fill();
                    mainCtx.closePath();
                }

            }
        }
    }
    //  Sets up the class to calculate where the electron pairs are located
    class compoundElectronConfig
    {
        constructor(formula)
        {
            this.centre = 30;
            this.formula = formula;
            switch (formula.length)
            {
                case 1:

                    this.atoms = 1;
    //                    Left Pair
                    this.pair1 = new electronPair(this.centre, this.centre, false, 1, false);

    //                    Top Pair
                    this.pair2 = new electronPair(this.centre - 31, this.centre, true, 1, false);

    //                    Right Pair
                    this.pair3 = new electronPair(-this.centre, -this.centre, false, 1, false);

    //                    Bottom Pair
                    this.pair4 = new electronPair(-this.centre + 31, -this.centre, true, 1, false);
                    this.electronPairs = [this.pair1, this.pair3, this.pair4, this.pair2];
                    if (formula[0] === "He" || formula[0] === "H")
                    {
                        this.pair6 = new electronPair(-this.centre + 31, -this.centre, true, 1, false);
                        this.electronPairs = [this.pair6];
                    }
                    break;
                case 3:

                    switch (this.formula[1])
                    {
                        case 1:

                            this.atoms = 2;
    //                    Left Pair
                            this.pair1 = new electronPair(this.centre + 31, this.centre, false, 1, false);
                            this.pair5 = new electronPair(this.centre - 29, this.centre, false, 1, true);
    //                    Top Pair
                            this.pair2 = new electronPair(this.centre, this.centre, true, 1, false);
                            this.pair6 = new electronPair(this.centre - 61, this.centre, true, 1, false);
    //                    Right Pair
                            this.pair3 = new electronPair(-this.centre + 31, this.centre, false, 1, true);
                            this.pair7 = new electronPair(-this.centre - 31, this.centre, false, 1, false);
    //                    Bottom Pair
                            this.pair4 = new electronPair(this.centre, -this.centre, true, 1, false);
                            this.pair8 = new electronPair(this.centre - 61, -this.centre, true, 1, false);

                            if (formula[0] === "H")
                            {
                                this.electronPairs = [this.pair3, this.pair6, this.pair7, this.pair8];

                            } else if (formula[2] === "H")
                            {
                                this.electronPairs = [this.pair1, this.pair2, this.pair4, this.pair5];


                            } else if (formula[2] === "H" && formula[0] === "H")
                            {
                                this.electronPairs = [this.pair3];

                            } else
                            {
                                this.electronPairs = [this.pair1, this.pair3, this.pair4, this.pair2, this.pair5, this.pair7, this.pair8, this.pair6];
                            }

                            break;

                        case 2:
    //                            Left Pair
                            this.atoms = 2;
                            this.pair1 = new electronPair(this.centre - 29, this.centre, false, 2, true);
                            this.pair5 = new electronPair(this.centre - 29, this.centre, false, 1, true);
    //                    Top Pair
                            this.pair2 = new electronPair(this.centre, this.centre, true, 1, false);
                            this.pair6 = new electronPair(this.centre - 61, this.centre, true, 1, false);
    //                    Right Pair
                            this.pair3 = new electronPair(-this.centre + 31, this.centre, false, 1, true);
                            this.pair7 = new electronPair(-this.centre + 31, this.centre, false, 2, true);
    //                    Bottom Pair
                            this.pair4 = new electronPair(this.centre, -this.centre, true, 1, false);
                            this.pair8 = new electronPair(this.centre - 61, -this.centre, true, 1, false);
                            this.electronPairs = [this.pair1, this.pair5, this.pair4, this.pair7, this.pair3, this.pair2, this.pair8, this.pair6];

                            break;

                        case 3:
    //                            Left Pair
                            this.atoms = 2;
    //                    Left Pair 1
                            this.pair1 = new electronPair(this.centre + 31, this.centre, false, 1, false);
    //                            this.pair5 = new electronPair(-this.centre + 31,this.centre,false,1,true);
    //                    Top Pair
                            this.pair2 = new electronPair(this.centre - 29, this.centre, false, 2, true);
    //                            this.pair6 = new electronPair(this.centre - 29,this.centre,false,2,true);
    //                    Right Pair 2
                            this.pair3 = new electronPair(-this.centre + 31, this.centre, false, 1, true);
                            this.pair7 = new electronPair(-this.centre - 31, this.centre, false, 1, false);
    //                    Bottom Pair
                            this.pair4 = new electronPair(this.centre - 29, this.centre, false, 3, true);

                            this.electronPairs = [this.pair3, this.pair4, this.pair2, this.pair7, this.pair1];
                            break;

                    }
                    break;
                case 5:

                    this.atoms = 3;
                    switch (this.formula[1])
                    {
                        case 1:
    //                    Left Pair
                            this.pair1 = new electronPair(this.centre + 62, this.centre, false, 1, false);
                            this.pair5 = new electronPair(this.centre, this.centre, false, 1, true);
                            this.pair9 = new electronPair(this.centre - 62, this.centre, false, 1, true);

    //                    Top Pair
                            this.pair4 = new electronPair(this.centre + 31, this.centre, true, 1, false);
                            this.pair8 = new electronPair(this.centre - 31, this.centre, true, 1, false);
                            this.pair12 = new electronPair(this.centre - 93, this.centre, true, 1, false);


    //                    Right Pair
                            this.pair3 = new electronPair(-this.centre - 62, -this.centre, false, 1, false);
                            this.pair7 = new electronPair(-this.centre, -this.centre, false, 1, true);
    //                            this.pair11 = new electronPair(-this.centre + 62, -this.centre,false,1,true);


    //                    Bottom Pair
                            this.pair2 = new electronPair(-this.centre + 93, -this.centre, true, 1, false);
                            this.pair6 = new electronPair(-this.centre + 31, -this.centre, true, 1, false);
                            this.pair10 = new electronPair(-this.centre - 31, -this.centre, true, 1, false);


                            this.electronPairs = [this.pair1, this.pair2, this.pair10, this.pair4, this.pair5, this.pair6, this.pair8, this.pair9, this.pair3, this.pair12];
                            if (this.formula[0] === "H" && this.formula[4] === "H" && this.formula[2] === "O")
                            {
                                this.electronPairs = [this.pair5, this.pair6, this.pair7, this.pair8];
                            }


                            break;
                        case 2:
    //                    Left Pair
                            this.pair1 = new electronPair(this.centre, this.centre, false, 2, true);
                            this.pair5 = new electronPair(this.centre, this.centre, false, 1, true);
    //                            this.pair9 = new electronPair(this.centre - 62, this.centre,false,1,true);

    //                    Top Pair
                            this.pair2 = new electronPair(this.centre + 31, this.centre, true, 1, false);
    //                            this.pair8 = new electronPair(this.centre - 31, this.centre,true,1,false);
                            this.pair6 = new electronPair(this.centre - 93, this.centre, true, 1, false);


    //                    Right Pair
                            this.pair3 = new electronPair(-this.centre, -this.centre, false, 2, true);
                            this.pair7 = new electronPair(-this.centre, -this.centre, false, 1, true);
    //                            this.pair11 = new electronPair(-this.centre + 62, -this.centre,false,1,true);


    //                    Bottom Pair
                            this.pair4 = new electronPair(-this.centre + 93, -this.centre, true, 1, false);
    //                            this.pair6 = new electronPair(-this.centre + 31, -this.centre,true,1,false);
                            this.pair8 = new electronPair(-this.centre - 31, -this.centre, true, 1, false);


                            this.electronPairs = [this.pair2, this.pair6, this.pair1, this.pair5, this.pair4, this.pair8, this.pair7, this.pair3];
                            break;
                    }

                    break;
            }
        }

        drawCompound()
        {

            switch (this.atoms)
            {
                case 1:

                    for (this.pairs = 0; this.pairs < (this.electronPairs.length); this.pairs += 2)
                    {
                        this.electronPairs[this.pairs].drawElectron();
                        this.electronPairs[this.pairs].updatePosition();
                    }

                    drawNucleus(main.width / 2 - this.centre, main.height / 2 - this.centre);
                    mainCtx.font = "30px Arial";
                    mainCtx.textAlign = "center";
                    mainCtx.fillText(this.formula[0], main.width / 2, main.height / 2 + 10);

                    for (this.pairs = 1; this.pairs < (this.electronPairs.length); this.pairs += 2)
                    {
                        this.electronPairs[this.pairs].drawElectron();
                        this.electronPairs[this.pairs].updatePosition();
                    }
                    break;
                case 2:

                    switch (this.formula[1])
                    {
                        case 1:
                            if (this.formula[0] === "H" || this.formula[2] === "H")
                            {
                                if
                                (this.formula[0] === "H" && this.formula[2] === "H")
                                {
                                    drawNucleus(main.width / 2 - this.centre - 31, main.height / 2 - this.centre);
                                    this.electronPairs[0].drawElectron();
                                    this.electronPairs[0].updatePosition();
                                    drawNucleus(main.width / 2 - this.centre + 31, main.height / 2 - this.centre);
                                } else if (this.formula[2] === "H")
                                {
                                    drawNucleus(main.width / 2 - this.centre - 31, main.height / 2 - this.centre);
                                    this.electronPairs[0].drawElectron();
                                    this.electronPairs[3].drawElectron();
                                    this.electronPairs[0].updatePosition();
                                    this.electronPairs[3].updatePosition();
                                    drawNucleus(main.width / 2 - this.centre + 31, main.height / 2 - this.centre);
                                    this.electronPairs[1].drawElectron();
                                    this.electronPairs[2].drawElectron();
                                    this.electronPairs[1].updatePosition();
                                    this.electronPairs[2].updatePosition();

                                } else if (this.formula[0] === "H")
                                {

                                    drawNucleus(main.width / 2 - this.centre - 31, main.height / 2 - this.centre);
                                    this.electronPairs[0].drawElectron();
                                    this.electronPairs[3].drawElectron();
                                    this.electronPairs[0].updatePosition();
                                    this.electronPairs[3].updatePosition();
                                    drawNucleus(main.width / 2 - this.centre + 31, main.height / 2 - this.centre);
                                    this.electronPairs[1].drawElectron();
                                    this.electronPairs[2].drawElectron();
                                    this.electronPairs[1].updatePosition();
                                    this.electronPairs[2].updatePosition();

                                }
                                break;


                            } else
                            {
                                for
                                (this.pairs = 0;
                                    this.pairs < 4;
                                    this.pairs += 2
                                )
                                {
                                    this.electronPairs[this.pairs].drawElectron();
                                    this.electronPairs[this.pairs].updatePosition();
                                }

                                drawNucleus(main.width / 2 - this.centre - 31, main.height / 2 - this.centre);

                                for (this.pairs = 1; this.pairs < 4; this.pairs += 2)
                                {
                                    this.electronPairs[this.pairs].drawElectron();
                                    this.electronPairs[this.pairs].updatePosition();
                                }

                                for (this.pairs = 4; this.pairs < 8; this.pairs += 2)
                                {
                                    this.electronPairs[this.pairs].drawElectron();
                                    this.electronPairs[this.pairs].updatePosition();
                                }

                                drawNucleus(main.width / 2 - this.centre + 31, main.height / 2 - this.centre);


                                for (this.pairs = 5; this.pairs < 8; this.pairs += 2)
                                {
                                    this.electronPairs[this.pairs].drawElectron();
                                    this.electronPairs[this.pairs].updatePosition();
                                }

                                break;

                            }

                        case 2:
                            for
                            (this.pairs = 0;
                                this.pairs < 4;
                                this.pairs++
                            )
                            {
                                this.electronPairs[this.pairs].drawElectron();
                                this.electronPairs[this.pairs].updatePosition();
                            }

                            drawNucleus(main.width / 2 - this.centre - 31, main.height / 2 - this.centre);

    //                            for (this.pairs = 1; this.pairs < 4; this.pairs += 2) {
    //                                this.electronPairs[this.pairs].drawElectron();
    //                                this.electronPairs[this.pairs].updatePosition();
    //                            }

                            for (this.pairs = 4; this.pairs < 8; this.pairs += 2)
                            {
                                this.electronPairs[this.pairs].drawElectron();
                                this.electronPairs[this.pairs].updatePosition();
                            }

                            drawNucleus(main.width / 2 - this.centre + 31, main.height / 2 - this.centre);

                            for (this.pairs = 5; this.pairs < 8; this.pairs += 2)
                            {
                                this.electronPairs[this.pairs].drawElectron();
                                this.electronPairs[this.pairs].updatePosition();
                            }
                            break;

                        case 3:
                            for
                            (this.pairs = 4;
                                this.pairs < 5;
                                this.pairs++
                            )
                            {
                                this.electronPairs[this.pairs].drawElectron();
                                this.electronPairs[this.pairs].updatePosition();
                            }
                            drawNucleus(main.width / 2 - this.centre - 31, main.height / 2 - this.centre);
                            for
                            (this.pairs = 0;
                                this.pairs < 3;
                                this.pairs++
                            )
                            {
                                this.electronPairs[this.pairs].drawElectron();
                                this.electronPairs[this.pairs].updatePosition();
                            }

    //
                            drawNucleus(main.width / 2 - this.centre + 31, main.height / 2 - this.centre);

                            for
                            (this.pairs = 3;
                                this.pairs < 4;
                                this.pairs++
                            )
                            {
                                this.electronPairs[this.pairs].drawElectron();
                                this.electronPairs[this.pairs].updatePosition();
                            }
                            break;



    //
                    }
                    mainCtx.font = "30px Arial";
                    mainCtx.textAlign = "center";
                    mainCtx.fillText(this.formula[0], main.width / 2 - 31, main.height / 2 + 10);
                    mainCtx.fillText(this.formula[2], main.width / 2 + 31, main.height / 2 + 10);

    //                    drawNucleus(canvas.width/2 + this.centre,canvas.height/2 - 30);
                    break;
                case 3:
                    switch (this.formula[1])
                    {

                        case 1:
    //                            alert(this.formula);

                            if (this.formula[0] === "H" && this.formula[4] === "H" && this.formula[2] === "O")
                            {

                                drawNucleus(main.width / 2 - this.centre - 61, main.height / 2 - this.centre);
                                for (this.pairs = 0; this.pairs < 2; this.pairs++)
                                {
                                    this.electronPairs[this.pairs].drawElectron();
                                    this.electronPairs[this.pairs].updatePosition();
                                }

                                drawNucleus(main.width / 2 - this.centre, main.height / 2 - this.centre);

                                for (this.pairs = 2; this.pairs < 4; this.pairs++)
                                {
                                    this.electronPairs[this.pairs].drawElectron();
                                    this.electronPairs[this.pairs].updatePosition();
                                }

                                drawNucleus(main.width / 2 - this.centre + 61, main.height / 2 - this.centre);
                                break;
                            } else
                            {
                                for (this.pairs = 0; this.pairs < 2; this.pairs += 1)
                                {
                                    this.electronPairs[this.pairs].drawElectron();
                                    this.electronPairs[this.pairs].updatePosition();
                                }
                                drawNucleus(main.width / 2 - this.centre - 61, main.height / 2 - this.centre);

                                for (this.pairs = 2; this.pairs < 6; this.pairs += 1)
                                {
                                    this.electronPairs[this.pairs].drawElectron();
                                    this.electronPairs[this.pairs].updatePosition();
                                }
                                drawNucleus(main.width / 2 - this.centre, main.height / 2 - this.centre);

                                for (this.pairs = 6; this.pairs < 8; this.pairs += 1)
                                {
                                    this.electronPairs[this.pairs].drawElectron();
                                    this.electronPairs[this.pairs].updatePosition();
                                }

                                drawNucleus(main.width / 2 - this.centre + 61, main.height / 2 - this.centre);

                                for (this.pairs = 8; this.pairs < (this.electronPairs.length); this.pairs += 1)
                                {
                                    this.electronPairs[this.pairs].drawElectron();
                                    this.electronPairs[this.pairs].updatePosition();
                                }
                                break;
                            }
                        case 2:

                            for (this.pairs = 4; this.pairs < 6; this.pairs++)
                            {
                                this.electronPairs[this.pairs].drawElectron();
                                this.electronPairs[this.pairs].updatePosition();

                            }

                            drawNucleus(main.width / 2 - this.centre - 61, main.height / 2 - this.centre);
                            for (this.pairs = 2; this.pairs < 4; this.pairs++)
                            {
                                this.electronPairs[this.pairs].drawElectron();
                                this.electronPairs[this.pairs].updatePosition();

                            }

                            drawNucleus(main.width / 2 - this.centre, main.height / 2 - this.centre);
                            for (this.pairs = 6; this.pairs < (this.electronPairs.length); this.pairs += 1)
                            {
                                this.electronPairs[this.pairs].drawElectron();
                                this.electronPairs[this.pairs].updatePosition();
                            }

                            drawNucleus(main.width / 2 - this.centre + 61, main.height / 2 - this.centre);
                            for (this.pairs = 0; this.pairs < 2; this.pairs++)
                            {
                                this.electronPairs[this.pairs].drawElectron();
                                this.electronPairs[this.pairs].updatePosition();
                            }
                            break;

                    }
                    mainCtx.font = "30px Arial";
                    mainCtx.textAlign = "center";
                    mainCtx.fillText(this.formula[2], main.width / 2, main.height / 2 + 10);
                    mainCtx.fillText(this.formula[0], main.width / 2 + 61, main.height / 2 + 10);
                    mainCtx.fillText(this.formula[4], main.width / 2 - 61, main.height / 2 + 10);
                    break;
            }
        }


    }


    Set.prototype.isSuperset = function (subset)
    {
        for (let elem of subset)
        {
            if (!this.has(elem))
            {
                return false;
            }
        }
        return true;
    };

    class Compound
    {
        constructor(atoms, mp, bp, waterSoluble, solidImage,liquidImage,gasImage, x, y)
        {
            this.atoms = atoms;
            this.mp = mp;
            this.bp = bp;
            this.state = "SOLID";
            this.conductor = false;
            this.waterSoluble = waterSoluble;
            this.x = 0;
            this.y = 0;
            this.solidImage = solidImage;
            this.liquidImage = liquidImage;
            this.gasImage = gasImage;
        }

        checkState(temperature, waterEnvironment)
        {
            if (temperature >= this.bp)
            {
                this.state = "GAS";
            }
            else if (temperature >= this.mp)
            {
                this.state = "LIQUID";
            }
            else
            {
                this.state = "SOLID";

            }

        }

        checkImage()
        {
            switch (this.state)
            {
                case "SOLID":
                    this.image = this.solidImage;
                    break;
                case "LIQUID" || "AQUEOUS":
                    this.image = this.liquidImage;
                    break;
                case "GAS":
                    this.image = this.gasImage;
                    break;

            }

            let image = new Image();
            image.src = this.image;

            try
            {
                mainCtx.beginPath();
                mainCtx.drawImage(image, this.x, this.y);
                mainCtx.closePath()
            }
            catch (Exception)
            {
                console.log(this.atoms, Exception);
            }
        }
    }

    //  Sets Up Ionic Compounds
    class IonicCompound extends Compound
    {
        constructor(atoms, mp, bp, waterSoluble, solidImage,liquidImage,gasImage, x, y,ions)
        {
            super(atoms, mp, bp, waterSoluble, solidImage,liquidImage,gasImage, x, y);
            //Define all variables for class here with this.[variableName]
            this.ions = ions;

        }

        checkState(temperature, waterEnvironment)
        {
            super.checkState(temperature, waterEnvironment);

            this.conductor = (this.state === "LIQUID" || this.state === "AQUEOUS");
        }
    }


    //  Sets Up Covalent Compounds
    class CovalentCompound extends Compound
    {
        constructor(atoms, mp, bp, waterSoluble, solidImage,liquidImage,gasImage, x, y,formula)
        {
            super(atoms, mp, bp, waterSoluble, solidImage,liquidImage,gasImage, x, y);

            this.formula = formula;
        }


    }

    //    Sets Up Ionic Compounds draw function
    class IonicCompoundConfig {
        constructor(cation, anion) {
            this.cation = cation;
            this.anion = anion;
            this.centre = 30;
            if (this.anion === "H") {
                this.pair1 = new electronPair(this.centre - 91, this.centre, true, 1, false);
                this.electronPairs = [this.pair1];

            } else {
                this.pair2 = new electronPair(this.centre - 91, this.centre, true, 1, false);
                this.pair1 = new electronPair(this.centre - 91, this.centre - 60, true, 1, false);
                this.pair3 = new electronPair(this.centre - 61, this.centre, false, 1, false);
                this.pair4 = new electronPair(this.centre - 121, this.centre, false, 1, false);
                this.electronPairs = [this.pair1, this.pair2, this.pair3, this.pair4];


            }

        }

        drawCompound() {
    //
            drawNucleus(main.width / 2 - 30 - 61, main.height / 2 - 30);
            mainCtx.font = "30px Arial";
            mainCtx.textAlign = "center";
            mainCtx.fillText(this.cation, main.width / 2 - 61, main.height / 2 + 10);


            if (this.anion === "H") {
                drawNucleus(main.width / 2 - 30 + 61, main.height / 2 - 30);
                mainCtx.font = "30px Arial";
                mainCtx.textAlign = "center";
                mainCtx.fillText(this.anion, main.width / 2 + 61, main.height / 2 + 10);
                for (this.i = 0; this.i < this.electronPairs.length; this.i++) {
                    this.electronPairs[0].drawElectron();
                    this.electronPairs[0].updatePosition();
                }
            } else {
                for (this.i = 0; this.i < 4; this.i += 2) {
                    this.electronPairs[this.i].drawElectron();
                    this.electronPairs[this.i].updatePosition();
                }
                drawNucleus(main.width / 2 - 30 + 61, main.height / 2 - 30);
                mainCtx.font = "30px Arial";
                mainCtx.textAlign = "center";
                mainCtx.fillText(this.anion, main.width / 2 + 61, main.height / 2 + 10);
                for (this.i = 1; this.i < 4; this.i += 2) {
                    this.electronPairs[this.i].drawElectron();
                    this.electronPairs[this.i].updatePosition();
                }
            }


        }
    }
    //  Checks for reactions
    class Reaction
    {
        constructor(reactants, products, requiredCondition)
        {
            this.reactants = reactants;
            this.products = products;
            let reaction = "";
            this.requiredCondition = requiredCondition;
        }

        checkForActivation(currentCompounds, property)
        {
            let willReact = true;
            let reactants = this.reactants;
            let products = this.products;
            let reaction = "";
            for (let i = 0; i < this.reactants.length; i++)
            {
                if (currentCompounds.find(function (element)
                    {
                        return element === reactants[i];
                    }) === undefined)
                {
                    willReact = false;

                    return currentCompounds
                }

            }
            switch (typeof property)
            {
                case "boolean":
                    willReact = property === this.requiredCondition;
                    break;
                case "number":
                    willReact = eval(property.toString() + this.requiredCondition);
                    break;
                default:
                    console.log(typeof property);
                    break;
            }

            if (willReact)
            {
                currentCompounds = currentCompounds.filter(x=> !new Set(reactants).has(x));
                reactants.forEach(x=> reaction+= x+" + ");
                reaction = reaction.slice(0,-2);
                reaction+= "-->";
                for (let i = 0; i < this.products.length; i++)
                {
                    if (currentCompounds.find(function (element)
                        {
                            return element === products[i]
                        }) === undefined)
                    {
                        reaction+= " "+products[i] + " +";
                        currentCompounds.push(products[i]);
                    }
                }

                reaction =reaction.slice(0,-2);
                recentReactions.unshift(reaction);

                return currentCompounds;
            }
            else
            {
                return currentCompounds;
            }
        }
    }

    //    List of possible compounds
    var possibleCompounds = //TODO: Add waterSoluble
        {
            ["NaH"]: new IonicCompound(["Na", "H"], 300, Infinity, false,"Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Na","H"]),
            ["NaCl"]: new IonicCompound(["Na", "Cl"], 801, 1465,true, "Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Na","Cl"]),
            ["MgO"]: new IonicCompound(["Mg", "O"], 2825, 3600, false, "Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Mg","O"]),
            ["LiOH"]: new IonicCompound(["Li", "OH"], 462, 924, true, "Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Li","OH"]),
            ["Li2O"]: new IonicCompound(["Li", "O"], 1438, 2600, false, "Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Li","O"]),
            ["NaOH"]: new IonicCompound(["Na","OH"], 318, 1388, true, "Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Na","OH"]),
            ["CuO"]: new IonicCompound(["Cu","O"],1326,2000,false,"Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Cu","O"]),
            ["H2SO4"]: new IonicCompound(["H","SO4"], 10, 337, true, "Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["H","SO4"]),
            ["KNO3"]: new IonicCompound(["K","NO3"], 334, 400, true, "Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["K","NO3"]),
            ["CaO"]: new IonicCompound(["Ca","O"], 2572, 2850, true, "Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Ca","O"]),
            ["KO2"]: new IonicCompound(["K","O"], 740, 740, true, "Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["K","O"]),
            ["ZnO"]: new IonicCompound(["Zn","O"], 1975, 2360, true, "Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Zn","O"]),
            ["CuSO4"]: new IonicCompound(["Cu","SO4"], 110, 200, true, "Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Cu","SO4"]),
            ["MgOH2"]: new IonicCompound(["Mg","OH"], 110, 350, true, "Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Mg","OH"]),




            ["H2O"]: new CovalentCompound(["H", "O"], 0, 100, true,"Resources/Rock.png","Resources/Liquid.png","Resources/Gas.png",0,0,["H",1,"O",1,"H"]),
        ["H2"]: new CovalentCompound(["H"], -259, -252, false,"Resources/Rock.png","Resources/Liquid.png","Resources/Gas.png",0,0,["H",1,"H"]),
        ["O2"]: new CovalentCompound(["O"], -219, -183, false,"Resources/Rock.png","Resources/Liquid.png","Resources/Gas.png",0,0,["O",2,"O"]),
        ["Cl2"]: new CovalentCompound(["Cl"], -102, -34, false,"Resources/Rock.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Cl",1,"Cl"]),
        ["Mg"]: new CovalentCompound(["Mg"], 620, 1091, false,"Resources/Strip.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Mg"]),
        ["Na"]: new CovalentCompound(["Na"], 98, 883, false,"Resources/Rock.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Na"]),
        ["F2"]: new CovalentCompound(["F"], -220, -188, true,"Resources/Rock.png","Resources/Liquid.png","Resources/Gas.png",0,0,["F",1,"F"]),
        ["HF"]: new CovalentCompound(["H", "F"], -84, 20, true,"Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["H",1,"F"]),
        ["He"]: new CovalentCompound(["He"], -272, -269, false, "Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["He"]),
        ["Ne"]: new CovalentCompound(["Ne"], -249, -246, false,"Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Ne"]),
        ["Cu"]: new CovalentCompound(["Cu"],1085,2562,false,"Resources/Strip.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Cu"]),
        ["Li"]: new CovalentCompound(["Li"], 180, 1330, false, "Resources/Rock.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Li"]),
        ["Ar"]: new CovalentCompound(["Ar"], -189, -186, false, "Resources/Gas.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Ar"]),
        ["K"]: new CovalentCompound(["K"], 64, 759, false, "Resources/Rock.png","Resources/Liquid.png","Resources/Gas.png",0,0,["K"]),
        ["Ca"]: new CovalentCompound(["Ca"], 842, 1484, false, "Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Ca"]),
        ["Zn"]: new CovalentCompound(["Zn"], 420, 907, false, "Resources/Strip.png","Resources/Liquid.png","Resources/Gas.png",0,0,["Zn"]),
        ["S"]: new CovalentCompound(["S"], 115, 445, false, "Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["S"]),
        ["HS"]: new CovalentCompound(["H","S"], -82, -60, false, "Resources/Liquid.png","Resources/Liquid.png","Resources/Gas.png",0,0,["H",1,"S"]),


        ["HCl"]: new CovalentCompound(["H", "Cl"], -114, -85, true, "Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["H",1,"Cl"]),
        ["CO2"]: new CovalentCompound(["C", "O"], -79, -79, true, "Resources/Powder.png","Resources/Liquid.png","Resources/Gas.png",0,0,["O",2,"C",2,"O"]),
    };
    var currentCompounds = [];
    var temperature = 25;
    var current = false;
    var UV = false;
    var waterEnvironment = false;

    //    Possible Reactions
    var possibleReactions =
    [
        [new Reaction(["H2", "O2"], ["H2O"], ">300"), "temperature"],
        [new Reaction(["H2O"], ["H2", "O2"], true), "current"],
        [new Reaction(["MgO", "H2O"], ["MgOH2"], true), "waterEnvironment"],
        [new Reaction(["Cl2", "H2"], ["HCl"], true), "UV"],
        [new Reaction(["MgOH2"], ["Mg", "H2O"], ">100"), "temperature"],
        [new Reaction(["Mg", "O2"], ["MgO"], ">50"), "temperature"],
        [new Reaction(["NaCl"], ["NaOH", "Cl2", "H2"], true), "current"],
        [new Reaction(["K","O2"], ["KO2"], ">50"), "temperature"],
        [new Reaction(["Zn","O2"], ["ZnO"], ">50"), "temperature"],
        [new Reaction(["NaCl","H2O"], ["NaOH", "Cl2", "H2"], true), "current"],
        [new Reaction(["CuSO4"], ["Cu", "SO4"], true), "current"],




    //          Michael's reactions
        [new Reaction(["H2O", "F2"], ["HF", "O2"], true), "waterEnvironment"],
        [new Reaction(["Li", "O2"], ["Li2O"], ">0"), "temperature"],
        [new Reaction(["Li2O", "HCl"], ["LiCl", "H2O"], ">100"), "temperature"],
        [new Reaction(["H2SO4"], ["H2","SO4"], true), "current"],
        [new Reaction(["Li", "H2O"], ["LiOH"], true), "waterEnvironment"],
        [new Reaction(["Li", "H2O"], ["LiOH"], true), "waterEnvironment"],
    ];
    let borderWidth = document.documentElement.clientWidth - 1320;
    //    Elements on the periodic table
    let elementStatus = [
        {element: "Hydrogen", x: 61, y: 31, status: false, symbol: "H", enabled: true, outlineColour: "rgba(220,0,0,0.8)"},
        {element: "Lithium", x: 61, y: 61, status: false, symbol: "Li", enabled: true, outlineColour: "rgba(255,138,23,1)"},
        {element: "Sodium", x: 61, y: 91, status: false, symbol: "Na", enabled: true, outlineColour: "rgba(255,100,0,1)"},
        {element: "Potassium", x: 61, y: 121, status: false, symbol: "K", enabled: true, outlineColour: "rgba(255,100,0,1)"},

        {element: "Magnesium", x: 91, y: 91, status: false, symbol: "Mg", enabled: true, outlineColour: "rgba(255,180,0,1)"},
        {element: "Calcium", x: 91, y: 121, status: false, symbol: "Ca", enabled: true, outlineColour: "rgba(255,180,0,1)"},

        {element: "Carbon", x: 481, y: 61, status: false, symbol: "C", enabled: true, outlineColour: "rgba(75,75,206,1)"},

        {element: "Oxygen", x: 511, y: 61, status: false, symbol: "O", enabled: true, outlineColour: "rgba(75,75,206,1)"},
        {element: "Sulfur", x: 511, y: 91, status: false, symbol: "S", enabled: true, outlineColour: "rgba(75,75,206,1)"},

        {element: "Fluorine", x: 541, y: 61, status: false, symbol: "F", enabled: true, outlineColour: "rgba(75,75,206,1)"},
        {element: "Chloride", x: 541, y: 91, status: false, symbol: "Cl", enabled: true, outlineColour: "rgba(75,75,206,1)"},

        {element: "Helium", x: 571, y: 31, status: false, symbol: "He", enabled: true, outlineColour: "rgba(191,0,223,1)"},
        {element: "Neon", x: 571, y: 61, status: false, symbol: "Ne", enabled: true, outlineColour: "rgba(191,0,223,1)"},
        {element: "Argon", x: 571, y: 91, status: false, symbol: "Ar", enabled: true, outlineColour: "rgba(191,0,223,1)"},

        {element: "Copper", x: 361, y: 121, status: false, symbol: "Cu", enabled: true, outlineColour: "rgba(84,156,64,1)"},

        {element: "Zinc", x: 391, y: 121, status: false, symbol: "Zn", enabled: true, outlineColour: "rgba(9,165,192,1)"},


        {element: "Hydroxide", x: 211, y: 268, status: false, symbol: "OH", enabled: true, outlineColour: "rgba(120,120,120,1)"},
        {element: "Sulphate", x: 241, y: 268, status: false, symbol: "SO4", enabled: true, outlineColour: "rgba(120,120,120,1)"},
        {element: "Nitrate", x: 271, y: 268, status: false, symbol: "NO3", enabled: true, outlineColour: "rgba(120,120,120,1)"}
    ];

    var beaker = document.getElementById("beaker");
    var beakerLiquid = document.getElementById("beakerLiquid");

    var compoundCombinations = [];
    for (let compound in possibleCompounds)
    {
        compoundCombinations.push(new Set(possibleCompounds[compound].atoms))
    }

    //    Function that assigns temperature to value in text box
    function tempUpdate() {
        let storedTemperature = document.getElementById("tempTextBox").value;
        current = document.getElementById("currentCheck").checked;

        temperature = Math.max(-3000, Math.min(storedTemperature, 3000));
        if (current){
            current = document.getElementById("currentCheck").checked = true;
        } else {
            current = document.getElementById("currentCheck").checked = false;
        }

        if (temperature < 0){
            tempText = temperature.toString();
        } else {
            tempText = temperature.toString();
        }
        updateCompound();
        document.getElementById("currentTemperature").innerHTML = "Current Temperature: " + tempText +"C";
        document.getElementById("tempTextBox").value = "";


    }

    //    Updates list of compounds for the user to select from
    function updateCompound(){
        option1 = document.getElementById("option1");
        option2 = document.getElementById("option2");
        option3 = document.getElementById("option3");
        option4 = document.getElementById("option4");
        option5 = document.getElementById("option5");
        option6 = document.getElementById("option6");
        option7 = document.getElementById("option7");

        try{
            for (compound = 0; compound < 7; compound++){
                console.log(currentCompounds[compound]);
                if (currentCompounds[compound] !== undefined) {
                    eval("option" + (compound + 1).toString()).innerHTML = currentCompounds[compound];
                } else {
                    eval("option" + (compound + 1).toString()).innerHTML = "None";

                }
            }
        } catch(err){
            alert("ERROR");
        }
        var selectedCompounds = document.getElementById("selectedCompound");
        selectedCompound = selectedCompounds.options[selectedCompounds.selectedIndex].value;
        switch (possibleCompounds[selectedCompound] instanceof CovalentCompound){
            case true:

                no = new compoundElectronConfig(possibleCompounds[selectedCompound].formula);
                break;
            case false:
                if (possibleCompounds[selectedCompound] !== undefined)
                {
                    no = new IonicCompoundConfig(possibleCompounds[selectedCompound].ions[0], possibleCompounds[selectedCompound].ions[1]);
                }
                break;
        }


    }

    //    Turns value inside temperature box to negative
    function negativeUpdate(){
        var store = document.getElementById("tempTextBox").value;
        store *= -1;
        document.getElementById("tempTextBox").value = store;


    }

    //    Event listener for when the user clicks or presses a key, removes cases of letters being inputed into text box
    c.addEventListener('click', onClickHandler, true);
    document.getElementById("tempTextBox").addEventListener("keydown", function (e)
    {
        var key = e.keyCode ? e.keyCode : e.which;

        if (!( [8, 9, 13, 27, 46, 110, 190].indexOf(key) !== -1 ||
                (key === 65 && ( e.ctrlKey || e.metaKey  ) ) ||
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57 && !(e.shiftKey || e.altKey)) ||
                (key >= 96 && key <= 105)
            ))
        {
            e.preventDefault();
        }

        if (key === 13){
            tempUpdate();
        }
    });

    //    Clears currentCompounds list
    function clearCompound(){
        currentCompounds = [];

        recentReactions = [];
        updateCompound();
    }

    //
    function onClickHandler(e)
    {
        let tableRect = c.getBoundingClientRect();
        let X = e.clientX - tableRect.left;
        let Y = e.clientY - tableRect.top;
        console.log(X, Y);
        let compound = [];
        for (i = 0; i < elementStatus.length; i++)
        {
            if (X > elementStatus[i].x && X < (elementStatus[i].x + 28) && Y > elementStatus[i].y && Y < (elementStatus[i].y + 28) && elementStatus[i].enabled)
            {
                elementStatus[i].status = !elementStatus[i].status;
            }
            if (elementStatus[i].status)
            {
                compound.push(elementStatus[i].symbol)
            }
        }
        let possibleBondPartner = new Set();
        for (let i in compoundCombinations)
        {
            if (compoundCombinations[i].isSuperset(compound))
            {
                [...compoundCombinations[i]].filter(x => !new Set(compound).has(x)).forEach(x => possibleBondPartner.add(x));
            }
        }

        elementStatus.forEach(function (x)

        {
            if (!possibleBondPartner.has(x.symbol) && !x.status)
            {
                x.enabled = false;
            }
            else
            {
                x.enabled = true;
            }
        });



        let fakeCompound = false;
        for (let i in possibleCompounds)
        {
            let sortedCompound = possibleCompounds[i].atoms;
            sortedCompound.sort();
            compound.sort();
            for (let j = 0; j < sortedCompound.length; j++)
            {
                if (sortedCompound.length !== compound.length || sortedCompound[j] !== compound[j])
                {
                    fakeCompound = true;
                    break;
                }
                else
                {
                    fakeCompound = false;
                }
            }
        }

        if (X > 2 && X < 332 && Y > 390 && Y < 480)
        {
            for (let i in possibleCompounds)
            {
                let atomsRequired = new Set(possibleCompounds[i].atoms);
                compound = new Set(compound);
                if (atomsRequired.size !== compound.size)
                {
                    continue;
                }
                let difference = new Set([...atomsRequired].filter(x => !compound.has(x)));
                if (difference.size === 0)
                {
                    compound = i;
                    break;
                }
            }
            if (compound.length >0)
            {
                currentCompounds.push(compound);
            }
            elementStatus.forEach(function (x)
            {
                x.status = false;
                x.enabled = true;
            });

            updateCompound();
            displayRecent();

        }

    }

    //    Displays the most recent reactions
    function displayRecent(){
        let place0 = document.getElementById("recentReactionsText1");
        let place1 = document.getElementById("recentReactionsText2");
        for (let a=0;a<2;a++){
            if (recentReactions[a] !== undefined){
                eval("place" + a).innerHTML = recentReactions[a];
            } else if (a === 0){
                eval("place0").innerHTML = "None";
            } else{
                eval("place" + a).innerHTML = "";
            }
        }
    }

    //    Toggles atomic view of the atom
    function toggleAtomic(){
        microView = document.getElementById("check").checked;

        try {

            if (!microView) {
                view = "macroView";
            } else if (microView) {
                view = "microView";
    //            alert(possibleCompounds[currentCompounds[0]].formula);
    //            alert(selectedCompound);

                switch (possibleCompounds[selectedCompound] instanceof CovalentCompound) {
                    case true:

                        no = new compoundElectronConfig(possibleCompounds[selectedCompound].formula);
                        break;
                    case false:
                        no = new IonicCompoundConfig(possibleCompounds[selectedCompound].ions[0], possibleCompounds[selectedCompound].ions[1]);
                        break;


                }

            } else {
                view = "macroView";
            }
        } catch(err){

        }
    }


    function draw()
    {
        if (view === "macroView")
        {
    //            Clears the screen
            mainCtx.beginPath();
            mainCtx.clearRect(0, 0, 656, 658);

        } else if (view === "microView")
    //
        {
            mainCtx.clearRect(0, 0, 658, 656);
            mainCtx.rect(0, 0, 658, 656);
            mainCtx.fillStyle = ("rgba(0,0,0,0.8)");
            mainCtx.fill();

            try{
                no.drawCompound();
            } catch (err)
            {

            }
        }
    //        Highlights & Outlines elements
        for (let i = 0; i < elementStatus.length; i++)
        {
            ctx.beginPath();
            if (elementStatus[i].enabled === false)
            {
                ctx.clearRect(elementStatus[i].x, elementStatus[i].y, 28, 28);
                ctx.rect(elementStatus[i].x, elementStatus[i].y, 28, 28);
                ctx.fillStyle = "rgba(0,0,0,0.5)";
                ctx.fill();
            }
            else if (elementStatus[i].status === true)
            {
                ctx.rect(elementStatus[i].x, elementStatus[i].y, 28, 28);
                ctx.fillStyle = elementStatus[i].outlineColour;
                ctx.fill();
                ctx.clearRect(elementStatus[i].x + 2, elementStatus[i].y + 2, 24, 24);
            } else
            {
                ctx.clearRect(elementStatus[i].x - 1, elementStatus[i].y - 1, 30, 30);
            }
        }
    //        Check if a reaction is occuring
        for (let i = 0; i < possibleReactions.length; i++)
        {
            currentCompounds = possibleReactions[i][0].checkForActivation(currentCompounds, eval(possibleReactions[i][1]));
        }
    //        Check is the state of a compound will change
        for (let i = 0; i < currentCompounds.length; i++)
        {
            try
            {
                possibleCompounds[currentCompounds[i]].checkState(temperature, waterEnvironment);
                if (view === "macroView")
                {
                    possibleCompounds[currentCompounds[i]].checkImage();
                }

            }
            catch (Exception)
            {
    //                alert("");
                console.log(currentCompounds[i]);
            }
        }
    //          Check if a reaction occurs from existing in water
        waterEnvironment = new Set(currentCompounds).has("H2O");

        for (let i = 0; i < currentCompounds.length; i++)
        {
            if (currentCompounds[i].state === "GAS")
            {
                beakerLiquid.style.zIndex = 4;
            } else if (currentCompounds[i].state === "SOLID")
            {

                beaker.style.zIndex = 3;
            }
        }

        displayRecent();
        requestAnimationFrame(draw);
    }

    draw();

}

