import request from '../utils/request';

export function getRecommendation(path, line) {
    return request.get(`http://localhost:8000/test`, {
        path,
        line
    })
}
