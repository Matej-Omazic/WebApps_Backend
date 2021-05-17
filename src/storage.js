let storage = {

    user:[

        {
            nickname: "GoodGuy",
            e_mail: "GoodGuy@gmail.com",
            password: "iamgood"

        },

        {
            nickname: "NotSoGoodGuy",
            e_mail: "NotSoGoodGuy@gmail.com",
            password: "iambad"
        },

    ],

    games:[
            {
                game_id:"1000",
                img_url: "https://i.ibb.co/CKFBPBv/Gta5.jpg",
                name:"Grand Theft Auto V",
                release_date:"17 September 2013",
                genre:"Action, Adventure, Comedy",
                rate:"97/100",
                writer:"Dan Houser, Rupert Humphries",
                developer:"Rockstar Games",
                publisher:"Rockstar Games",
                platforms:"Playstation 3/4/5, Xbox 360/One, PC",
                budget:"$265,000,000 (estimated)",
                route:"/GtaV"
            },

            {
                game_id:"1001",
                img_url: "https://i.ibb.co/rdMnFhR/zelda.jpg",
                name:"The Legend of Zelda: Breath of the Wild",
                release_date:"3 March 2017",
                genre:"Action, Adventure, Fantasy",
                rate:"97/100",
                writer:"Hidemaro Fujibayashi, Hiroki Hirano",
                developer:"Nintendo EPD",
                publisher:"Nintendo",
                platforms:"Nintendo Switch, Wii U",
                budget:"$20,000,000 (estimated)",
                route:"/Zelda"
            },
        
        

    ],

    comments:[

        {
            comment: "Good Game",
            game_id: "1001",
            author: "GoodGuy"

        },

        {
            comment: "Bad Game",
            game_id: "1002",
            author: "NotSoGoodGuy"
        },

    ],

    playlist:[

        {
            author: "GoodGuy",
            game_id: "1001",

        },

        {
            author: "NotSoGoodGuy",
            game_id: "1002",
        },

    ]

}

export default storage