// Fixed header section - replace the user auth logic section

// Around line 34-40, replace this:
const { isAuthenticated: authStatus, user: authUser} = useAuth();
const [mounted, setMounted] = useState(false);

useEffect(() => {
	setMounted(true);
}, []);

const isAuthenticated = mounted ? authStatus : false;
const user = mounted ? authUser : null;

// With this simpler version:
const { isAuthenticated, user, isLoading } = useAuth();

// And then in the JSX, update the user profile section to handle loading:

{/* User Profile or Login */}
{isLoading ? (
	<div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
) : isAuthenticated ? (
	<ProfileDropdown
		align="end"
		trigger={
			<button className="rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all" type="button">
				<Avatar className="size-9 cursor-pointer">
					<AvatarImage src={user?.avatar} alt="User"/>
					<AvatarFallback className="bg-primary/10 text-primary font-semibold">
						{user?.fullName ? user.fullName.charAt(0).toUpperCase() : <CircleUser size="28" />}
					</AvatarFallback>
				</Avatar>
			</button>
		}
	/>
) : (
	<LoginButton />
)}