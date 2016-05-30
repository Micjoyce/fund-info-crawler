module.exports = function(RawDB, DataTypes){
    var BondSectorBreakdown = RawDB.define('BondSectorBreakdown', {
        Code: {
            type: DataTypes.sequelize.STRING,
            primaryKey: true
        },
        Date: {
            type: DataTypes.sequelize.DATE,
            allowNull: false,
            primaryKey: true
        },
        TreasuryBond: {
            type: 'DOUBLE',
            allowNull: true
        },
        CentralBankNote: {
            type: 'DOUBLE',
            allowNull: true
        },
        FinancialBond: {
            type: 'DOUBLE',
            allowNull: true
        },
        CorporateBond: {
            type: 'DOUBLE',
            allowNull: true
        },
        CommercialPaper: {
            type: 'DOUBLE',
            allowNull: true
        },
        MedianTermNote: {
            type: 'DOUBLE',
            allowNull: true
        },
        Convertible: {
            type: 'DOUBLE',
            allowNull: true
        },
        OtherBond: {
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

    return BondSectorBreakdown;
};
