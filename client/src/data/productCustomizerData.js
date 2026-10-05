export const productCustomizerData = {
  'soccer-uniform': {
    category: 'Sportswear',

    name: 'Soccer Uniform',

    eyebrow:
      'Custom Teamwear',

    title:
      'Build Your Soccer Uniform',

    description:
      'Create a complete custom soccer kit for your club, academy or team. Choose the items you need, select sizes and colors, add player details and send us your exact customization requirements.',

    items: [
      {
        id: 'soccer-jersey',

        name: 'Jersey / Shirt',

        description:
          'Custom soccer jersey with team logo, player number, player name and short or long sleeve options.',

        sizes: [
          'XS',
          'S',
          'M',
          'L',
          'XL',
          '2XL',
          '3XL',
          '4XL',
        ],

        colors: [
          '#080808',
          '#ffffff',
          '#e10600',
          '#0047ab',
          '#00a651',
          '#f5d000',
          '#ff7a00',
          '#712b8f',
          '#ff69b4',
          '#7f8c8d',
          '#5b0016',
          '#00a9e0',
        ],

        options: {
          sleeve: [
            'Short Sleeve',
            'Long Sleeve',
          ],
        },

        playerDetails: true,

        logoUpload: true,
      },

      {
        id: 'soccer-shorts',

        name: 'Soccer Shorts',

        description:
          'Matching performance shorts with custom team colors, club logo and optional player number.',

        sizes: [
          'XS',
          'S',
          'M',
          'L',
          'XL',
          '2XL',
          '3XL',
          '4XL',
        ],

        colors: [
          '#080808',
          '#ffffff',
          '#e10600',
          '#0047ab',
          '#00a651',
          '#f5d000',
          '#ff7a00',
          '#712b8f',
          '#7f8c8d',
          '#5b0016',
        ],

        playerNumber: true,

        logoUpload: true,
      },

      {
        id: 'soccer-socks',

        name: 'Soccer Socks',

        description:
          'Long team socks designed to cover shin guards with coordinated team colors.',

        sizes: [
          'Youth',
          'S',
          'M',
          'L',
          'XL',
        ],

        colors: [
          '#080808',
          '#ffffff',
          '#e10600',
          '#0047ab',
          '#00a651',
          '#f5d000',
          '#ff7a00',
          '#712b8f',
          '#00a9e0',
        ],
      },

      {
        id: 'shin-guards',

        name: 'Shin Guards',

        description:
          'Protective shin guards for training and match use with custom color options.',

        sizes: [
          'Youth S',
          'Youth M',
          'Youth L',
          'Adult S',
          'Adult M',
          'Adult L',
        ],

        colors: [
          '#080808',
          '#ffffff',
          '#e10600',
          '#0047ab',
          '#00a651',
          '#f5d000',
        ],
      },

      {
        id: 'soccer-cleats',

        name:
          'Soccer Cleats / Boots',

        description:
          'Studded soccer footwear for field performance with flexible sizing and color customization.',

        sizes: [
          'US 5',
          'US 6',
          'US 7',
          'US 8',
          'US 9',
          'US 10',
          'US 11',
          'US 12',
          'US 13',
        ],

        colors: [
          '#080808',
          '#ffffff',
          '#e10600',
          '#0047ab',
          '#00a651',
          '#f5d000',
          '#ff7a00',
          '#00e5ff',
        ],
      },
    ],
  },
}