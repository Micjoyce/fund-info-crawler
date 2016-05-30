module.exports = function(RawDB, DataTypes){
    var EquitySectorBreakdown = RawDB.define('EquitySectorBreakdown', {
        Code: {
            type: DataTypes.sequelize.STRING,
            primaryKey: true
        },
        Date: {
            type: DataTypes.sequelize.DATE,
            allowNull: false,
            primaryKey: true
        },
        A: {
            type: 'DOUBLE',
            allowNull: true
        },
        B: {
            type: 'DOUBLE',
            allowNull: true
        },
        C: {
            type: 'DOUBLE',
            allowNull: true
        },
        D: {
            type: 'DOUBLE',
            allowNull: true
        },
        E: {
            type: 'DOUBLE',
            allowNull: true
        },
        F: {
            type: 'DOUBLE',
            allowNull: true
        },
        G: {
            type: 'DOUBLE',
            allowNull: true
        },
        H: {
            type: 'DOUBLE',
            allowNull: true
        },
        I: {
            type: 'DOUBLE',
            allowNull: true
        },
        J: {
            type: 'DOUBLE',
            allowNull: true
        },
        K: {
            type: 'DOUBLE',
            allowNull: true
        },
        L: {
            type: 'DOUBLE',
            allowNull: true
        },
        M: {
            type: 'DOUBLE',
            allowNull: true
        },
        N: {
            type: 'DOUBLE',
            allowNull: true
        },
        O: {
            type: 'DOUBLE',
            allowNull: true
        },
        P: {
            type: 'DOUBLE',
            allowNull: true
        },
        Q: {
            type: 'DOUBLE',
            allowNull: true
        },
        R: {
            type: 'DOUBLE',
            allowNull: true
        },
        S: {
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

    return EquitySectorBreakdown;
};
