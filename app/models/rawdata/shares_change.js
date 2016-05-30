module.exports = function(RawDB, DataTypes){
    var SharesChange = RawDB.define('SharesChange', {
        Code: {
            type: DataTypes.sequelize.STRING,
            primaryKey: true
        },
        Date: {
            type: DataTypes.sequelize.DATE,
            allowNull: false,
            primaryKey: true
        },
        TotalShares: {
            type: 'DOUBLE',
            allowNull: true
        },
        SharesPurchased: {
            type: 'DOUBLE',
            allowNull: true
        },
        SharesRedeemed: {
            type: 'DOUBLE',
            allowNull: true
        },
        NetSharesChange: {
            type: 'DOUBLE',
            allowNull: true
        },
        PercentChange: {
            type: DataTypes.sequelize.STRING,
            allowNull: true
        },
        LastUpdate: {
            type: DataTypes.sequelize.DATE,
            allowNull: true
        }
    }, {
        // instanceMethods: {
        //     getLatestNav: function() {
        //         return FundNavModel.scope({method: ['latestNav', this.Code]}).findOne();
        //     },
        //     getAssetClassFactors: function() {
        //         return FundAssetClassFactorsModel.findOne({where: {Code: this.Code}});
        //     },
        //     getLatestRank: function() {
        //         return FundRankModel.scope({method: ['latestRank', this.Code]}).findOne();
        //     }
        // },
        // scopes: {
        //     byFundIds: function(fids) {
        //         return {
        //             where: {
        //                 Code: {
        //                     $in: fids
        //                 }
        //             }
        //         }
        //     }
        // }
    });

    return SharesChange;
};
