module.exports = function(RawDB, DataTypes){
    var FundAssetAllocation = RawDB.define('FundAssetAllocation', {
        Code: {
            type: DataTypes.sequelize.STRING,
            primaryKey: true
        },
        Date: {
            type: DataTypes.sequelize.DATE,
            allowNull: false,
            primaryKey: true
        },
        Asset: {
            type: 'DOUBLE',
            allowNull: true
        },
        NetAsset: {
            type: 'DOUBLE',
            allowNull: true
        },
        Equity: {
            type: 'DOUBLE',
            allowNull: true
        },
        Bond: {
            type: 'DOUBLE',
            allowNull: true
        },
        Cash: {
            type: 'DOUBLE',
            allowNull: true
        },
        InverseRepo: {
            type: 'DOUBLE',
            allowNull: true
        },
        Other: {
            type: 'DOUBLE',
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

    return FundAssetAllocation;
};
