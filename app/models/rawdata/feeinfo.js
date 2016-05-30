module.exports = function(RawDB, DataTypes){
    var FeeInfo = RawDB.define('FeeInfo', {
        Code: {
            type: DataTypes.sequelize.STRING,
            primaryKey: true
        },
        ManagementFee: {
            type: DataTypes.sequelize.STRING,
            allowNull: true
        },
        CustodianFee: {
            type: DataTypes.sequelize.STRING,
            allowNull: true
        },
        ServiceFee: {
            type: DataTypes.sequelize.STRING,
            allowNull: true
        },
        FrontEndLoad: {
            type: DataTypes.sequelize.STRING,
            allowNull: true
        },
        MaxFrontEndLoad: {
            type: DataTypes.sequelize.STRING,
            allowNull: true
        },
        BackendLoad: {
            type: DataTypes.sequelize.STRING,
            allowNull: true
        },
        MaxBackendLoad: {
            type: DataTypes.sequelize.STRING,
            allowNull: true
        },
        RedemptionFee: {
            type: DataTypes.sequelize.STRING,
            allowNull: true
        },
        MaxRedemptionFee: {
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

    return FeeInfo;
};
