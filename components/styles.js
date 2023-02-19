import StyleSheet from 'react-native';

export function GenerateStyles(deviceHeight, deviceWidth, theme) {
    StyleSheet.create({
        container: {
            height: deviceHeight,
            width: deviceWidth,
            backgroundColor: theme.background
        },
        profileHeader: {
            width: deviceWidth,
            height: deviceHeight*(1-headerHeight)*0.3,
            alignItems: 'center',
            marginBottom: deviceHeight*0.05,
        },
        headerBar: {
            height: deviceHeight*headerHeight,
            width: deviceWidth,
            backgroundColor: theme.background2,
            flexDirection: 'row',
            position: 'absolute',
            top: 0,
            elevation: 15,
            alignItems: 'flex-end',
            justifyContent: 'space-between',
        },
        headerText: {
            fontFamily: theme.font,
            fontSize: deviceHeight*0.035,
            color: theme.onBackground,
            margin:deviceHeight*0.005,
            marginLeft: deviceWidth*0.02,
        },
        navbar: {
            height: deviceHeight*0.07,
            width: deviceWidth,
            backgroundColor: theme.background2,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            position: 'absolute',
            bottom: 0,
            elevation: 15,
            borderColor: theme.outline,
            borderWidth: deviceHeight*0.002
        },
        item: {
            backgroundColor: theme.background2,
            width: deviceWidth,
            marginBottom: deviceHeight*0.005
        },
        postTitle: {
            fontFamily: theme.font,
            fontSize: deviceHeight*0.025,
            color: theme.onBackground,
            margin:deviceHeight*0.005,
            marginLeft: deviceWidth*0.02,
        },
        postControlBar: {
            width: deviceWidth, 
            height: deviceHeight*0.06,
            flexDirection: 'row',
            alignItems: 'center',
        },
        icon: {
            width: deviceHeight*0.05,
            height: deviceHeight*0.05,
            marginRight: deviceWidth*0.025,
            tintColor: theme.onBackground2
        },
        pfpLarge: {
            height: deviceWidth*0.4,
            width: deviceWidth*0.4,
            marginTop: deviceHeight*0.025,
            borderRadius: deviceWidth*0.2
        },
        pfpSmall: {
          width: deviceHeight*0.04,
          height: deviceHeight*0.04,
          marginRight: deviceWidth*0.025,
          borderRadius: deviceHeight*0.02
        },
        toTopButton: {
            width: deviceWidth*0.12,
            height: deviceWidth*0.12,
            backgroundColor: theme.accent,
            borderRadius: deviceWidth*0.06,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            right: deviceWidth*0.025,
            bottom: deviceHeight*0.12,
            elevation: 15,
        },
        smallText: {
            width: deviceWidth*0.9,
            fontFamily: theme.font,
            color: theme.onBackground,
            fontSize: deviceHeight*0.02,
            marginHorizontal: deviceWidth*0.025,
            flexWrap: 'wrap'
        },
        listItem: {
          width: deviceWidth*0.5,
          height: deviceHeight*0.035,
          backgroundColor: theme.background2,
          marginTop: -1
        }
    });
}