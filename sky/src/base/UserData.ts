namespace base {

    export class UserData {

        uid: string;
        data: Object = null;
        
        static instance: UserData = null;

        private constructor(uid: string) {
            this.uid = uid;
        }

        public static async Init(uid) {
            UserData.instance = new UserData(uid);
            UserData.instance.data = await API.call("load_user_data", { uid: this.instance.uid });
        }

        public static async Sync() {
            await API.call("save_user_data", {
                uid: this.instance.uid,
                data: this.instance.data,
            });
        }
    }

}