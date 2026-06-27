export class UserService {
	getUsers() {
		return [
			{
				id: 1,
				name: "Thitiwat Chueangjareanwit",
				position: "Student",
			},
			{
				id: 2,
				name: "Sanya Sriprasert",
				position: "Student",
			},
		];
	}

	async getAllUsers(query: any) {
		return null;
	}

	async createUser(body: any) {
		return null;
	}

	async getUserById(id: string) {
		return null;
	}

	async updateUser(id: string, body: any) {
		return null;
	}

	async deleteUser(id: string) {
		return null;
	}
}
