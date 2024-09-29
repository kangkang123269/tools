

// 获取歌词链接
export class Http {
    public static getMusic() {
        return fetch('https://api.uomg.com/api/rand.music?sort=%E7%83%AD%E6%AD%8C%E6%A6%9C&format=json').then(res => res.json())
    }

    // public downloadMusic(id: string) {
        
    // }
}