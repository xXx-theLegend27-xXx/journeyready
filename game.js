// HELPER FUNCTIONS

// returns true or false randomally
// the argument is the probability of true (1 is always true, 0 is always false)

// creates a string of a link to a dictionary term
function dictLink(term, txt) {
    return "<a onclick='showDictionary(\"" + term + "\")'>" + txt + "</a>";
}

function chance(p) {
    return Math.random() <= p;
}

// returns a random number between A and B
function randomBetween(a, b) {
    return Math.random() * (b - a) + a;
}

// sets all of the bars elements values to the bar values
function refreshBars() {
    for (var b in Game.bars) {
        Game.bars[b].elem.style.width = (Game.bars[b].value.toString()) + "%";
        // The textElem will have the number to the 2nd decimal point.
        Game.bars[b].textElem.innerHTML = Math.floor(Game.bars[b].value * 100) / 100;
    }
}

// Shows the dictionary and scrolls to the term ID
function showDictionary(term) {
    var dict = document.getElementById("dictionary");
    dict.className = "show";
    dict.scrollTo(0, 0);
    try {
        dict.scrollTo(0, document.getElementById(term).offsetTop);
    } catch (_) {}
}

function closeDictionary() {
    var dict = document.getElementById("dictionary");
    // Reset position
    dict.className = "";
}

// pops a card from the top of the deck and displays it
function pickDeckCard(deck) {
    // Hide deck picker
    elems.deckPicker.style.display = "none";
    // Show cards container
    elems.cardDisplay.style.display = "";

    // Pick the top card
    var topCard = deck.cards.shift();
    // if there is a card
    if (topCard !== undefined) {
        // Display the card
        elems.card.title.innerHTML = topCard.title;
        elems.card.description.innerHTML = topCard.description;
        elems.card.img.style.display = "none";
        if (topCard.img !== undefined) {
            elems.card.img.src = topCard.img;
            elems.card.img.style.display = "block";
        }
        // Display the choices
        elems.choice.one.innerHTML = topCard.firstChoice.text;
        elems.choice.oneContainer.onclick = topCard.firstChoice.onclick;
        elems.choice.two.innerHTML = topCard.secondChoice.text;
        elems.choice.twoContainer.onclick = topCard.secondChoice.onclick;
    }
}

function showLoss(reason) {
    var loseScreen = document.getElementById("lose-screen");
    var loseReason = document.getElementById("lose-reason");
    loseScreen.style.display = "block";
    loseReason.innerHTML = reason;
}

function showWin() {
    document.getElementById("win-screen").style.display = "block";
}

function calculateBars() {
    // Enemy power increases
    Game.bars.enemy.value *= 1.03;
    // Food grows with land
    Game.bars.food.value += Game.bars.land.value * 0.05;
    // Food is eaten by soldiers
    Game.bars.food.value -= Game.bars.soldier.value * 0.08;

    // Check for loss or win
    if (Game.bars.soldier.value > Game.bars.enemy.value) {
        showWin();
    }

    var reasons = [];

    if (Game.bars.food.value <= 0) {
        reasons.push("לא היה לך אוכל");
    }
    if (Game.bars.soldier.value <= 0) {
        reasons.push("לא היו לך חיילים");
    }
    if (Game.bars.land.value <= 0) {
        reasons.push("לא היה לך שטח");
    }

    if (reasons.length != 0) {
        showLoss(reasons.join(" ו"));
    }
}

// Run after every choice so you can pick another deck and see the bars update
function nextCard() {
    calculateBars();
    refreshBars();
    showDeckPicker();
    // Check for winning conditions
    // WIP!
}

// Shuffles an array
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

// shuffles all CardDecks
function shuffleDecks() {
    for (var c = 0; c < CardDecks.length; c++) {
        shuffle(CardDecks[c].cards);
    }
}

function showDeckPicker() {
    // hide cardDisplay
    elems.cardDisplay.style.display = "none";
    // Show deckPicker
    elems.deckPicker.style.display = "";

    elems.deckPicker.innerHTML = "";
    for (var d = 0; d < CardDecks.length; d++) {
        var deck = CardDecks[d];
        // There must be at least 1 card for you to see the deck
        if (deck.cards.length !== 0) {
            var deckPreview = document.createElement("div");
            deckPreview.className = "deck-back";
            deckPreview.setAttribute("index", d);

            deckPreview.addEventListener("click", function (e) {
                var el = e.target;
                var index = el.getAttribute("index");
                while (index === null) {
                    el = el.parentNode;
                    index = el.getAttribute("index");
                }
                pickDeckCard(CardDecks[index]);
            });

            var deckTitle = document.createElement("h2");
            deckTitle.innerHTML = deck.title;
            deckPreview.appendChild(deckTitle);
            elems.deckPicker.appendChild(deckPreview);
        }
    }
}


function refreshScale() {
    // This function sets class "tall" on HTML tag when the screen is tall

    if (window.innerWidth < window.innerHeight) {
        // Tallscreen
        document.body.className = "tall";
    } else {
        // Widescreen
        document.body.className = "";
    }
}

// Adds a random card from a deck to a random playable deck (CardDeck).
// Does not pop the card.
function summonCard(deck) {
    // Randomally selected card
    var card = deck[Math.floor(Math.random() * deck.length)];
    var usableDecks = [];
    for (var d = 0; d < CardDecks.length; d++) {
        if (CardDecks[d].cards.length > 0) {
            usableDecks.push(CardDecks[d].cards);
        }
    }

    if (usableDecks.length > 0) {
        var randomDeck = usableDecks[Math.floor(Math.random() * usableDecks.length)];
        var i = Math.floor(Math.random() * randomDeck.length);
        randomDeck.splice(i, 0, card);
    }
}

window.addEventListener("resize", refreshScale);
window.addEventListener("load", refreshScale);

// Hide the loader when window is loaded
window.addEventListener("load", function () {
    document.getElementById("load-page").style.display = "none";
});

/*
HELPERS SUMMARY:
chance(a)
- returns true or false randomally
- the argument is the probability of true (1 is always true, 0 is always false)

refreshBars()
- sets all of the bar elements width to their value

pickDeckCard(Deck)
- pops a card from the top of a given Deck and displays it

showDeckPicker()
- hides the card, shows the deckPicker
- dynamically picks the deck picker content

nextCard()
- use at the end of a card's function
- refreshBars()
- showDeckPicker()
- check winning conditions

shuffle(array)
- randomally shuffles a given array and overwrites it

shuffleDecks()
- shuffles all CardDecks

refreshScale()
- used to tell the CSS whether the screen is tall or wide

summonCard()
- Adds a random card from a deck to a random playable deck (CardDeck)
- Does not pop the card

dictLink()
- creates a string of a link to a dictionary term

*/

// GAME LOGIC



/*
Every pack must store:
1. title -> string
2. cards -> array

Every card must store:
1. title -> string
2. description -> string
3. firstChoice ->
    text -> string
    onclick -> function
4. secondChoice is the same as firstChoice

*/

var Summoned = {
    minorRebellion: [{
            title: "מרד משני",
            description: "חקלאים רבים במערב הממלכה דורשים עוד מזון, ופחות מסים. הם מגדלים כ-15% מהמזון.",
            firstChoice: {
                text: "להתעלם ולאבד 5% עד 10% מהשטח",
                onclick: function () {
                    Game.bars.land.value *= (0.95 - Math.random() * 0.05);
                    nextCard();
                }
            },
            secondChoice: {
                text: "לשלם ב-10% מהמזון",
                onclick: function () {
                    Game.bars.food.value *= 0.9;
                    nextCard();
                }
            }
        },
        {
            title: "מרד משני",
            description: "אוספי מסים ספורים במזרח שוכנעו על ידי התושבים ונלחמים נגדך.<br>הם לא נותנים לך את האוכל שהם משיגים. (לפחות 5% מאוכל)",
            firstChoice: {
                text: "להתעלם ולאבד 5% עד 10% מהאוכל",
                onclick: function () {
                    Game.bars.food.value *= (0.95 - Math.random() * 0.05);
                    nextCard();
                }
            },
            secondChoice: {
                text: "להילחם בהם עם 5 כוח אדם (הם אנשים חזקים, קשה לנצח אותם)",
                onclick: function () {
                    Game.bars.soldier.value -= 5;
                    nextCard();
                }
            }
        }
    ],
    rebellion: [{
        title: "מרד - לוחמים רבים עוזבים את שלטונך לממלכות קרובות",
        description: "לוחמים עוזבים את שלטונך ובורחים אל ממלכות קרובות.<br>הם 20% מהלוחמים. אין לך מה לעשות.",
        firstChoice: {
            text: "להתמודד עם זה",
            onclick: function () {
                Game.bars.soldier.value *= 0.8;
                nextCard();
            }
        },
        secondChoice: {
            text: "להתמודד עם זה",
            onclick: function () {
                Game.bars.soldier.value *= 0.8;
                nextCard();
            }
        }
    }],
    minorSupport: [{
        title: "תמיכה משנית מהעם",
        description: "תושבים במערב הממלכה נותנים חלק מהאוכל שהם אוגרים לממשלה מרוב שהם משוכנעים שהממלכה טובה.",
        firstChoice: {
            text: "לקחת 3 מזון ולהחזיר לאנשים בסביבה - 25% לתמיכה משנית מהעם.",
            onclick: function () {
                Game.bars.food.value += 3;
                // add minor support 1/4 of the times
                if (chance(1 / 4)) {
                    summonCard(Summoned.minorSupport);
                }
                nextCard();
            }
        },
        secondChoice: {
            text: "לקחת 6 מזון ולא להחזיר לאנשים בסביבה.",
            onclick: function () {
                Game.bars.food.value += 6;
                nextCard();
            }
        }
    }],
    support: [{
            title: "תמיכה מהעם",
            description: "תושבים רבים רוצים לצאת למסע הצלב בגלל חובתם המוסרית וכמה שהם אוהבים את הממלכה. הם 20 כוח אדם.",
            firstChoice: {
                text: "לא לצרף אותם (שימושי אם יש יותר מדי כוח אדם)",
                onclick: nextCard
            },
            secondChoice: {
                text: "לצרף את כולם (+20 כוח אדם)",
                onclick: function () {
                    Game.bars.soldier.value += 20;
                    nextCard();
                }
            }
        },
        {
            title: "תמיכה מהעם",
            description: "אוספי המסים אוהבים אותך ולכן נותנים לך עוד יותר אחוזים ממה שהם אוספים (הם לוקחים כמה אחוזים לעצמם). הגבר את כמות האוכל ב-15%.",
            firstChoice: {
                text: "לתת את האוכל לתושבים ולקבל תמיכה אחרת מהעם.",
                onclick: function () {
                    summonCard(Summoned.support);
                    nextCard();
                }
            },
            secondChoice: {
                text: "להגביר את כמות האוכל ב-15.",
                onclick: function () {
                    Game.bars.food.value += 15;
                    nextCard();
                }
            }
        }
    ]
};

var CardDecks = [{
        title: "חפיסה 1 - ארגון המשאבים והשטחים",
        cards: [{
                title: "בחודשיים האחרונים היה הרבה גשם ברחבי הממלכה",
                description: "אוספי המסים אספו הרבה יותר מזון הפעם.",
                firstChoice: {
                    text: "לא לאסוף מזון ולקבל תמיכה מהעם, בכך שנותנים את המזון מהמסים לאנשים",
                    onclick: function () {
                        summonCard(Summoned.support);
                        nextCard();
                    }
                },
                secondChoice: {
                    text: "לאסוף 10 מזון",
                    onclick: function () {
                        Game.bars.food.value += 10;
                        nextCard();
                    }
                }
            },
            {
                title: " תושבים דיווחו על " + dictLink("dict-feodom", "פיאודום") + " חדש וקטן שקם מזרחה לממלכה ",
                description: "הפיאודום לא יהיה חזק מספיק כדי להילחם ולכן לא יפגע בממלכה.\nאפשר להשתלט עליו עם רק 4 כוח אדם.",
                firstChoice: {
                    text: "לתת לפאודום להישאר (אבל הוא אף פעם לא יהיה חזק מהממלכה שלך)",
                    onclick: nextCard
                },
                secondChoice: {
                    text: "להסתער על הפאודום (דורש 4 כוח אדם, מחזיר 5 שטח)",
                    onclick: function () {
                        Game.bars.land.value += 5;
                        Game.bars.soldier.value -= 4;
                        nextCard();
                    }
                }
            },
            {
                title: " תושבים דיווחו על " + dictLink("dict-feodom", "פיאודום") + " נחמד באדמה נוחה שקם צפון מזרחה לממלכה",
                description: "הפיאודום לא יהיה חזק מספיק כדי להילחם ולכן לא יפגע בממלכה.\nאפשר להשתלט עליו עם רק 7 כוח אדם.",
                firstChoice: {
                    text: "לתת לפאודום להישאר (אבל הוא אף פעם לא יהיה חזק מהממלכה שלך).",
                    onclick: nextCard
                },
                secondChoice: {
                    text: "להסתער על הפאודום (דורש 7 כוח אדם, מחזיר 8 שטח).",
                    onclick: function () {
                        Game.bars.soldier.value -= 7;
                        Game.bars.land.value += 8;
                        nextCard();
                    }
                }
            },
            {
                title: "הכנסייה תומכת בך",
                description: "ומשום כך, תושבים רבים מוכנים להתגייס לכוח האדם.",
                firstChoice: {
                    text: "להתעלם",
                    onclick: nextCard
                },
                secondChoice: {
                    text: "לגייס את האנשים (10 כוח אדם), לאבד את 5 השטח שהם שלטו עליו.",
                    onclick: function () {
                        Game.bars.soldier.value += 10;
                        Game.bars.land.value -= 5;
                        nextCard();
                    }
                }
            },
            {
                title: "שבטים אחדים מאיימים על תושבים שגרים בקצה הצפוני של הממלכה",
                description: "התושבים מצפון הממלכה מפחדים, ומבקשים עזרה.",
                firstChoice: {
                    text: "לתת להם לפחד ולאבד 5 שטח ולקבל סיכוי של 20% למרד משני.",
                    onclick: function () {
                        Game.bars.land.value -= 5;
                        if (chance(1 / 5)) {
                            summonCard(Summoned.minorRebellion);
                        }
                        nextCard();
                    }
                },
                secondChoice: {
                    text: "להשתמש ב-8 כוח אדם כדי להביס את השבטים. צריך גם להחזיר 2 שטח לתושבים.",
                    onclick: function () {
                        Game.bars.soldier.value -= 8;
                        Game.bars.land.value -= 2;
                        nextCard();
                    }
                }
            },
            {
                title: "חקלאים רבים בתנאי עבדות בממלכה דורשים עוד כוח",
                description: "אפשר לתת להם 5 שטח כדי שיתמכו בממלכה, אך אם לא עושים כלום - הם עשויים למרוד במרד משני.",
                firstChoice: {
                    text: "לא לתת להם כלום ולהוסיף סיכוי של 50% למרד משני",
                    onclick: function () {
                        if (chance(1 / 2)) {
                            summonCard(Summoned.minorRebellion);
                        }
                        nextCard();
                    }
                },
                secondChoice: {
                    text: "לתת להם 5 שטח ולקבל תמיכה משנית מהעם",
                    onclick: function () {
                        Game.bars.land.value -= 5;
                        summonCard(Summoned.minorSupport);
                        nextCard();
                    }
                }
            },
            {
                title: "נמצא שטח ריק בקרבת מקום",
                description: "מקום קטן עם אדמה נוחה לגידול אוכל וכמה אנשים.",
                firstChoice: {
                    text: "להתעלם",
                    onclick: nextCard
                },
                secondChoice: {
                    text: "להשתלט על השטח (דורש 5 כוח אדם, מחזיר 10 שטח)",
                    onclick: function () {
                        Game.bars.soldier.value -= 5;
                        Game.bars.land.value += 10;
                        nextCard();
                    }
                }
            },
            {
                title: "בפאודום קרוב האדון וכל משפחתו נרצחו. לאחר שנוצר הכאוס, אבירים רבים מחפשים איש חדש לשרת.",
                description: "הם דורשים 5 שטח ו-5 אוכל, ויש להם 8 כוח אדם.",
                firstChoice: {
                    text: "לסלק אותם",
                    onclick: nextCard
                },
                secondChoice: {
                    text: "לשלם 5 אוכל ו-5 שטח כדי לקבל 8 כוח אדם",
                    onclick: function () {
                        Game.bars.food.value -= 5;
                        Game.bars.land.value -= 5;
                        Game.bars.soldier.value += 8;
                        nextCard();
                    }
                }
            }
        ]
    },
    {
        title: "חפיסה 2 - צבירת שטח בדרכים חדשות ולקיחת סיכונים",
        cards: [{
                title: "הכנסיה מתנגדת לתמוך בממלכתך",
                description: "הם מוכנים לתמוך בממלכה ובך אם ינתנו להם 5 מזון, 5 כוח אדם ו-5 שטח.",
                firstChoice: {
                    text: "להתעלם (סיכוי של 40% למרד משני, אחרת 5% למרד רגיל)",
                    onclick: function () {
                        if (chance(0.4)) {
                            summonCard(Summoned.minorRebellion);
                        } else if (chance(0.05)) {
                            summonCard(Summoned.minorRebellion);
                        }
                        nextCard();
                    }
                },
                secondChoice: {
                    text: "להסכים ולשלם לכנסיה (ולקבל קלף תמיכה מהעם שנותן יתרון)",
                    onclick: function () {
                        Game.bars.food.value -= 5;
                        Game.bars.soldier.value -= 5;
                        Game.bars.land.value -= 5;
                        summonCard(Summoned.support);
                        nextCard();
                    }
                }
            },
            {
                title: "הייתה פלישה לממלכה",
                description: "פלשו חבורה של אבירים והם הרסו ובזזו שטחים בקצה הממלכה. האנשים כועסים.",
                firstChoice: {
                    text: "להתעלם (להוסיף קלף של מרד משני)",
                    onclick: function () {
                        summonCard(Summoned.rebellion);
                        nextCard();
                    }
                },
                secondChoice: {
                    text: "לפצות אותם (ב- 5 אוכל ו- 5 שטח) ולקבל קלף תמיכה משנית מהעם",
                    onclick: function () {
                        summonCard(Summoned.minorSupport);
                        Game.bars.food.value -= 5;
                        Game.bars.land.value -= 5;
                        nextCard();
                    }
                }
            },
            {
                title: "מלחמה פרצה בינך לבין ממלכה קרובה",
                description: "ממלכה מצפון לממלכה שלך החליט להכריז על מלחמה עליך. הממלכה מהצפון קטנה בהרבה מהממלכה שלך.",
                firstChoice: {
                    text: "להלחם - 60% ניצחון (20 כוח אדם, 20 שטח, 20 אוכל), 40% הפסד (להתחיל מחדש)",
                    onclick: function () {
                        if (chance(0.6)) {
                            Game.bars.soldier.value += 20;
                            Game.bars.land.value += 20;
                            Game.bars.food.value += 20;
                        } else {
                            Game.bars.soldier.value = 0;
                            Game.bars.land.value = 0;
                            Game.bars.food.value = 0;
                        }
                        nextCard();
                    }
                },
                secondChoice: {
                    text: "לשלם כדי להמנע ממלחמה (30 שטח)",
                    onclick: function () {
                        Game.bars.land.value -= 30;
                        nextCard();
                    }
                }
            },
            {
                title: "יועצך ממליץ לצאת למלחמה",
                description: "ממלכה צמודה אל הממלכה מתחילה לגדול ולצבור כוח, יועצך ממליץ לעצור אותם לפני שיפילו את הממלכה.",
                firstChoice: {
                    text: "לעזוב אותם (לקחת סיכון (50% סיכוי - לאבד 20% מהשטח ו-10% מכוח האדם))",
                    onclick: function () {
                        if (chance(0.5)) {
                            Game.bars.land.value *= 0.8;
                            Game.bars.soldier.value *= 0.9;
                        }
                        nextCard();
                    }
                },
                secondChoice: {
                    text: "לתקוף אותם (דורש 10 כוח אדם, 90% לקבל 10 שטח - אחרת לאבד 15 כוח אדם בסה\"כ)",
                    onclick: function () {
                        Game.bars.soldier.value -= 10;
                        if (chance(0.9)) {
                            Game.bars.land.value += 10;
                        } else {
                            Game.bars.soldier.value -= 5;
                        }
                        nextCard();
                    }
                }
            },
            {
                title: "אנשים רבים רוצים עוד כנסיות",
                description: "אפשר לשלם ב-15 שטח לכנסייה כדי לקבל קלף תמיכה מהעם.",
                firstChoice: {
                    text: "להתעלם",
                    onclick: nextCard
                },
                secondChoice: {
                    text: "לשלם 15 שטח",
                    onclick: function () {
                        Game.bars.land.value -= 15;
                        summonCard(Summoned.support);
                        nextCard();
                    }
                }
            },
            {
                title: "מלחמה בין ממלכה לפאודום",
                description: "פאודום בגודל קטן ממלכתך, מהמזרח, מכריזה עליך מלחמה.",
                firstChoice: {
                    text: "להיכנע ולתת שטח (מבזבז 7 שטח)",
                    onclick: function () {
                        Game.bars.land.value -= 7;
                        nextCard();
                    }
                },
                secondChoice: {
                    text: "להגן (מבזבז 5 כוח אדם (לא מביא שטח רק מבריח את האבירים של הפאודום השני)",
                    onclick: function () {
                        Game.bars.soldier.value -= 5;
                        nextCard();
                    }
                }
            },
            {
                title: "משלחת לוחמים",
                description: "משלחת לוחמים חזרה מהתקפה.",
                firstChoice: {
                    text: "להתעלם",
                    onclick: nextCard
                },
                secondChoice: {
                    text: "לקבל 10 כוח אדם ולבזבז 20 מזון",
                    onclick: function () {
                        Game.bars.soldier.value += 10;
                        Game.bars.food.value -= 20;
                        nextCard();
                    }
                }
            },
            {
                title: "התושבים מורדים",
                description: "התושבים אומרים שהיחס שלך גרוע והם דורשים מזון.",
                firstChoice: {
                    text: "להתעלם (סיכוי של 50% שתפסיד את הכל)",
                    onclick: function () {
                        if (chance(0.5)) {
                            Game.bars.food.value = 0;
                            Game.bars.soldier.value = 0;
                            Game.bars.land.value = 0;
                        }
                        nextCard();
                    }
                },
                secondChoice: {
                    text: "לתת להם 20 מזון",
                    onclick: function () {
                        Game.bars.food.value -= 20;
                        nextCard();
                    }
                }
            }
        ]
    },
    {
        title: "חפיסה 3 - ארגון כוח האדם והמזון",
        cards: [{
                title: "הלוחמים רעבים",
                description: "מספר לוחמים פנו אליך בבקשה לתוספת אוכל ומים, כיוון שהם גוועים ברעב.",
                firstChoice: {
                    text: "לוותר עליהם (לאבד 3 כוח אדם)",
                    onclick: function () {
                        Game.bars.soldier.value -= 3;
                        nextCard();
                    }
                },
                secondChoice: {
                    text: "לתת להם יותר מזון (לאבד 5 מזון)",
                    onclick: function () {
                        Game.bars.food.value -= 5;
                        nextCard();
                    }
                }
            },
            {
                title: "ממלכה נופלת ומוכרת את כוח האדם שנותר לה",
                description: "הלוחמים מוכנים להצטרף לממלכה גם בתנאים נמוכים.<br>הם רוצים רק 10 מזון ויש להם 8 כוח אדם.",
                firstChoice: {
                    text: "להתעלם",
                    onclick: nextCard
                },
                secondChoice: {
                    text: "לשלם להם במזון",
                    onclick: function () {
                        Game.bars.food.value -= 10;
                        Game.bars.soldier.value += 8;
                        nextCard();
                    }
                }
            },
            {
                title: "אנשים רבים מוכנים להתגייס למסע הצלב, אם יקבלו אוכל",
                description: "תושבי כפרים רבים מוכנים להקריב את עצמם בשביל אוכל למשפחתם.",
                firstChoice: {
                    text: "להתעלם",
                    onclick: nextCard
                },
                secondChoice: {
                    text: "לשלם ב-5 אוכל ולקבל 5 כוח אדם",
                    onclick: function () {
                        Game.bars.food.value -= 5;
                        Game.bars.soldier.value += 5;
                        nextCard();
                    }
                }
            },
            {
                title: "אנשים רבים במערב הממלכה רוצים להצטרף למסע הצלב",
                description: "הם רק רוצים מזון למשפחתם מאחור (כי הם משיגים אוכל למשפחה). אפשר לשלם להם 5 מזון והם יתנו 10 כוח אדם. המשפחות שלהם לא תומכות במהלך - ולכן אם ניקח את האנשים, יש סיכוי למרד משני.",
                firstChoice: {
                    text: "להתעלם",
                    onclick: nextCard
                },
                secondChoice: {
                    text: "לתת להם מזון ולקבל מהם כוח אדם, ולקבל סיכוי של 25% לקבל קלף מרד משני",
                    onclick: function () {
                        Game.bars.food.value += 5;
                        Game.bars.soldier.value += 10;
                        if (chance(0.25)) {
                            summonCard(Summoned.minorRebellion);
                        }
                        nextCard();
                    }
                }
            },
            {
                title: "לא היה גשם בחודשיים האחרונים. התושבים גוועים ברעב",
                description: "סוחרים רבים מהדרום מביאים את האוכל שהם גידלו ומוכרים אותו ביוקר. כוח האדם עשוי לגווע ברעב, אך האוכל הוא מאוד יקר.",
                firstChoice: {
                    text: "להשאיר אותם רעבים, בין 5% ל-40% מכוח האדם יגווע ברעב",
                    onclick: function () {
                        Game.bars.soldier.value *= (0.95 - Math.random() * 0.35);
                        nextCard();
                    }
                },
                secondChoice: {
                    text: "לקנות להם אוכל מהסוחרים תמורת 30 שטח.",
                    onclick: function () {
                        Game.bars.land.value -= 30;
                        nextCard();
                    }
                }
            },
            {
                title: "מצאתם מאגר מזון של הסלג'וקים",
                description: "יש לכם הרבה מזל",
                firstChoice: {
                    text: "לקחת את האוכל (+5 אוכל וכוח הסלג'וקים יורד ב-3)",
                    onclick: function () {
                        Game.bars.food.value += 5;
                        Game.bars.enemy.value -= 3;
                        nextCard();
                    }
                },
                secondChoice: {
                    text: "לקחת את האוכל (+5 אוכל וכוח הסלג'וקים יורד ב-3)",
                    onclick: function () {
                        Game.bars.food.value += 5;
                        Game.bars.enemy.value -= 3;
                        nextCard();
                    }
                }
            }
        ]
    }
];



var Game = {};
var elems = {};

function setup() {
    // setup game basics
    // setup bars

    Game.bars = {
        enemy: {
            value: 35,
            elem: document.getElementById("enemy-bar"),
            textElem: document.getElementById("enemy-bar-text")
        },
        land: {
            value: 20,
            elem: document.getElementById("land-bar"),
            textElem: document.getElementById("land-bar-text")
        },
        food: {
            value: 20,
            elem: document.getElementById("food-bar"),
            textElem: document.getElementById("food-bar-text")
        },
        soldier: {
            value: 20,
            elem: document.getElementById("soldier-bar"),
            textElem: document.getElementById("soldier-bar-text")
        }
    };

    refreshBars();

    // setup elements
    elems.card = {
        title: document.getElementById("card-title"),
        description: document.getElementById("card-description"),
        img: document.getElementById("card-image")
    };

    elems.deckPicker = document.getElementById("pick-deck");
    elems.cardDisplay = document.getElementById("card-display");

    elems.choice = {
        one: document.getElementById("text-one"),
        oneContainer: document.getElementById("one"),
        two: document.getElementById("text-two"),
        twoContainer: document.getElementById("two"),
    };

    // ready the game
    shuffleDecks();

    // display the game
    showDeckPicker();
}

window.addEventListener("load", setup);