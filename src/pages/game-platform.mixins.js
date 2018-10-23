// import { getGameInfo } from '../apis/get'
import { mapActions, mapState } from 'vuex'

export default {
    data() {
        return {
            games: [],
            platformData: [],
            platforms: [],
            GAME_ID: 0
        }
    },
    computed: {
        ...mapState({
            gameInfo: state => state.main.gameInfo,
            platformInfo: state => state.main.platformInfo
        })
    },
    created() {
        // if(!this.gameInfo.length) {
        this.getGameInfo()
            .then(json => {
                if(json.code == 200) {
                    var ret = json.result.platform_info || []
                    this.games = json.result.game
                    this.GAME_ID = this.games[0].id
                    this.platformData = ret
                    this.platforms = this.handleData(this.GAME_ID, this.games, ret)
                }
            })
        // } else {
        //     this.games = this.gameInfo
        //     this.GAME_ID = this.games[0].id
        //     this.platformData = this.platformInfo
        //     this.platforms = this.handleData(this.GAME_ID, this.games, this.platformData)
        // }
    },
    methods: {
        ...mapActions(['getGameInfo']),
        handleData(id, games, data) {
            // var _n = games.filter(e => e.id == id)[0].nickname
            // var ret = []
            // var _d = data[_n]
            // for(var i in _d) {
            //     ret.push({
            //         name: _d[i][0].name,
            //         value: _d[i][0].id
            //     })
            // }
            // return ret
            return data.filter(el => el.game_id == id)
        }
    }
}
