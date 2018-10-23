export function handleTagList(data) {
    var temp = {}
    data.map(e => {
        if(temp[e.group_name]) {
            temp[e.group_name].children.push({id: e.id, tag_name: e.tag_name, group_name: e.group_name})
        } else {
            temp[e.group_name] = {}
            temp[e.group_name].children = []
            temp[e.group_name].children.push({id: e.id, tag_name: e.tag_name, group_name: e.group_name})
        }
    })

    var ret = []
    for(var i in temp) {
        ret.push({
            group_name: i,
            children: temp[i].children
        })
    }
    return ret
}
