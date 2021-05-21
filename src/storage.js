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
                rate:"96/100",
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
            comment: "One of the most highly anticipated games we have seen ever and it has not disappointed. I have been a fan since the very first GTA entered my console a number of years ago and have played them ever since with great enjoyment and GTA 5 just tops the rest.",
            game_id: "1001",
            author: "GoodGuy"

        },

        {
            comment: "Okay so the campaign is fine in fact it's great but the online is so broken and so toxic it's unbelievable I've sold this game once and I might do it again it's so laggy and broken I'm done with it.",
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