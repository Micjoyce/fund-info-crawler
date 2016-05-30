module.exports = function(RawDB, DataTypes) {
    var FundBasicModel = RawDB.define('fundbasics', {
        Code: {
            type: DataTypes.sequelize.STRING,
            primaryKey: true
        },
        Name: {
            type: DataTypes.sequelize.STRING,
            allowNull: false
        },
        Company: {
            type: DataTypes.sequelize.STRING(50),
            allowNull: true
        },
        Category: {
            type: DataTypes.sequelize.STRING(10),
            allowNull: true
        },
        Type: {
            type: DataTypes.sequelize.STRING(10),
            allowNull: true
        },
        Status: {
            type: DataTypes.sequelize.INTEGER(3),
            allowNull: true
        },
        Inception: {
            type: DataTypes.sequelize.DATE,
            defaultValue: null
        },
        LastUpdate: {
            type: DataTypes.sequelize.DATE,
            defaultValue: null
        },
        SubCategory: {
            type: DataTypes.sequelize.STRING(30),
            allowNull: true
        }

    }, {
        instanceMethods: {
            // getLatestNav: function() {
            //     return FundNavModel.scope({method: ['latestNav', this.Code]}).findOne();
            // }
        },
        scopes: {
            byFundIds: function(fids) {
                return {
                    where: {
                        Code: {
                            $in: fids
                        }
                    }
                }
            }
        }
    });

    return FundBasicModel;
};
