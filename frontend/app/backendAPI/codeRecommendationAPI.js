import { request}  from '../utils'

export function getRecommendation(path, line) {
    return request.get(`http://localhost:8000/test`, {
        path,
        line
    })
}
