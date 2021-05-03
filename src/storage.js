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
                name:"Grand Theft Auto V",
                release_date:"17.10.2013",
                genre:"Action",
                rate:"97/100",
                writer:"Dan Houser, Rupert Humphries",
                developer:"Rockstar Games",
                publisher:"Rockstar Games",
                platforms:"Playstation 3/4/5, Xbox 360/One, PC",
                budget:"$265,000,000 (estimated)"
            },

            {
                game_id:"1001",
                name:"The Legend of Zelda: Breath of the Wild",
                release_date:"3.3.2017",
                genre:"Action",
                rate:"97/100",
                writer:"Hidemaro Fujibayashi, Hiroki Hirano",
                developer:"Nintendo EPD",
                publisher:"Nintendo",
                platforms:"Nintendo Switch, Wii U",
                budget:"$20,000,000 (estimated)"
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