//TESTING PURPOSES - creates a database with comments added

var mongoose = require("mongoose");
var Accomodation = require("./models/accomodation");
var Comment = require("./models/comment");
var User = require("./models/user");

//The generic accomodations that will be added upon server run
var data = [
    {
        name: "Aberdream Firehouse", 
        image: "https://i1.wp.com/thelincolnite.co.uk/wp-content/uploads/2019/10/Finished-exterior-9.jpg?fit=1860%2C1043&ssl=1",
        price: "800",
        description: "OOOOOH HEAVEN IS A PLACE ON EARTH"
    },
    {
        name: "Glassygow", 
        image: "https://www.qub.ac.uk/home/media/resize-1-1.jpg",
        price: "666",
        description: "too hot in here"
    },
    {
        name: "Inversnecky", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRw9pr4P-QlloMnTBJgBsqGvNMNfW6oc9OdjgVIfQ2WfgnU_CX_&usqp=CAU",
        price: "3121",
        description: "Is she flat or round?"
    },
    {
        name: "Sigma Tau",
        image: "https://www.shemazing.net/wp-content/uploads/2019/08/frat-656x440.png",
        description: "Bro's and Woes",
        price: "210"
    }
];

const seedUserData = {
    username: "SeedTester",
    password: "SeedTester"
};

// seed user first to ensure User exists, call seedAccomdoationData only AFTER user is sure to exist
function seedDB() {
    // Check if seed user exists
    User.findOne({ username: "SeedTester" })
        .then(userData => {
            // if Homer does not exist, create Homer
            if (!userData) {
                console.log("Seed user does not exists. Creating user...");
                const seedUser = new User({
                    username: seedUserData.username
                });

                // Have Homer register properly with a hashed password
                User.register(seedUser, seedUserData.password, (err, data) => {
                    if (err) console.error(err);
                    console.log(`${data.username} successfully created...`);
                    // Then we can seed accomodation data
                    seedAccData();
                });
            } else {
                // if seed user does exist, carry on to seed accomodation data
                console.log(`${userData.username} exists...`);
                seedAccData();
            }
        })
        .catch(errCreatingSeedUser => {
            console.error(errCreatingSeedUser);
        });
}


function seedAccData() {
    console.log("seeding database...");
    // Find our seed user and save data into userData
    User.findOne({ username: "SeedTester" })    //What user will leave the comment
        .then(userData => {
            //+-- then, DROP all accomodation data
            Accomodation.remove(() => {
                console.log("Accomodations deleted...");
                //+-- then, DROP all comment data
                Comment.remove(() => {
                    console.log("Comments deleted...");
                }).catch(errRemovingComments => {
                    console.error(errRemovingComments);
                });
                // +-- then, ITERATE through all seed data and
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    // CREATE accomodation seed data using seed userData
                    Accomodation.create({
                        name: element.name,
                        image: element.image,
                        price: element.price,
                        description: element.description,
                        author: { id: userData._id, username: userData.username }
                    })
                        .then(accomodationData => {
                            // +-- then, CREATE comment for seed accmodationData using seed userData
                            console.log(`${accomodationData.name} added...`);
                            Comment.create({
                                text:
                                    "Generic Seed Comment:\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ornare dolor ut felis dignissim, sed ornare risus ullamcorper. Nam nec tortor sollicitudin, dapibus quam eget, sodales sem. Proin non bibendum magna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent ac fringilla arcu. In porttitor ex orci. Pellentesque nisl risus, cursus vel ultricies nec, suscipit a nisl. Duis gravida leo quis risus cursus, non malesuada metus ornare. Duis et ex finibus, lacinia velit sit amet, venenatis nisi. Cras ut libero arcu. Nam eget purus elementum, ultricies dolor eu, mattis nibh. ",
                                author: { id: userData._id, username: userData.username }
                            })
                                .then(newComment => {
                                    //+-- then finally, RELATE new comment to accomodation obj
                                    accomodationData.comments.push(newComment);
                                    accomodationData.save();
                                    console.log(
                                        `New comment inserted for ${accomodationData.name}...`
                                    );
                                })
                                .catch(errCreatingComment => console.error(errCreatingComment));
                        })
                        .catch(errCreatingAcc => console.error(errCreatingAcc));
                }
            }).catch(errRemovingAcc => {
                console.error(errRemovingAcc);
            });
        })
        .catch(errFindingUser => {
            console.error(errFindingUser);
        });
}

// Neatly package 100 lines of code into one line
module.exports = seedDB;









module.exports = seedDB;
