
import dayjs from 'dayjs'

const FORMAT = 'YYYY-MM-DD HH:mm:ss'

export default {
    methods: {
        handleDate(d) {
            return dayjs(d).format(FORMAT)
        },

        customDate(d, f) {
            return dayjs(d).format(f)
        }
    }
}
