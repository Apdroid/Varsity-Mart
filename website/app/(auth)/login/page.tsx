import { use } from "react";
export default function Login() {
	const handleSubmit = use(handleSubmitFunction());
	function handleSubmitFunction(e: React.FormEvent) {
		e.preventDefault();
	}

	return <div>login</div>;
}
