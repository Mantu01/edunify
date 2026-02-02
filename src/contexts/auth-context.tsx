import { LoginSchemaType, SignupSchemaType } from "@/lib/schema";
import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Loader from '@/components/ui/loader';
import { toast } from "sonner";
import { Provider } from "@/lib/constants";

interface AuthContext{
  isLoading:boolean,
  verificationPending:boolean,
  showError:boolean,
  handleSubmit:(data: LoginSchemaType | SignupSchemaType)=>void,
  handleSignOut:()=>void;

  loadingStates:Record<string, boolean>,
  handleSocialLogin: (provider: Provider) => void,
}

const AuthContext=createContext<AuthContext | undefined>(undefined);

export const AuthProvider=({children}:{children:ReactNode})=>{

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verificationPending,setVerificationPending]=useState<boolean>(false);
  const {isLoaded: isSignInLoaded,signIn,setActive} = useSignIn();
  const [showError,setShowError]=useState<boolean>(false);
  const {isLoaded: isSignUpLoaded,signUp} = useSignUp();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const router=useRouter();
  const searchParams=useSearchParams();
  const pathname = usePathname();
  const {signOut}=useClerk();
  
  const err=searchParams.get('err');
  const selectedRole=searchParams.get('role');
  const mode = pathname.replace('/', '');

  useEffect(()=>{
    if(err==='not-found'){
      setShowError(true);
    }
  },[searchParams,err]);

  const handleSocialLogin = async (provider: Provider) => {
    setLoadingStates(prev => ({ ...prev, [provider]: true }));
    try {
      if (mode === 'login') {
        if (!isSignInLoaded) {
          toast.error("Login is not ready yet.");
          return;
        }
        await signIn.authenticateWithRedirect({
          strategy: `oauth_${provider}`,
          redirectUrl:'/signup?err=not-found',
          redirectUrlComplete: "/room",
        });
        toast.success("Redirecting to login...");
      } else {
        if (!isSignUpLoaded) {
          toast.error("Signup is not ready yet.");
          return;
        }
        await signUp.authenticateWithRedirect({
          strategy: `oauth_${provider}`,
          unsafeMetadata:{
            role:selectedRole
          },
          redirectUrl:'/signup/continue',
          redirectUrlComplete: "/room",
        });
        toast.success("Redirecting to signup...");
      }
    } catch{
      toast.error("Something went wrong during authentication.");
    } finally {
      setLoadingStates(prev => ({ ...prev, [provider]: false }));
    }
  };

  async function handleSubmit(data: LoginSchemaType | SignupSchemaType) {
    setIsLoading(true);
    try {
      if (mode === 'login') {
        if(!isSignInLoaded){
          return <Loader/>
        }
        const loginData=data as LoginSchemaType;
        const loginAttempt=await signIn.create({
          identifier:loginData.email,
          password:loginData.password
        });
        if(loginAttempt.status==='complete'){
          await setActive({
            session:loginAttempt.createdSessionId,
          });
          toast.success('Logged In successful');
          setTimeout(()=>router.push('/room'),300);
        }
      } else {
        if(!isSignUpLoaded){
          return <Loader/>
        }
        const signupData=data as SignupSchemaType;
        await signUp.create({
          username:signupData.username,
          emailAddress:signupData.email,
          password:signupData.password,
          unsafeMetadata:{
            role:selectedRole
          }
        });

        await signUp.prepareEmailAddressVerification({
          strategy:'email_code'
        });
        setVerificationPending(true);
      }
    } catch (err:unknown) {
      const error=err as ClerkError;
      toast.error(error.errors[0].message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut({redirectUrl:'/login'});
      toast.success('Logout successful');
    } catch {
      toast.error('Error log out')
    }
  }

  if(!isSignInLoaded || !isSignUpLoaded){
    return <Loader/>
  }

  return (
    <AuthContext.Provider value={{
      handleSubmit,
      isLoading,
      verificationPending,
      showError,
      handleSocialLogin,
      loadingStates,
      handleSignOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(){
  const context=useContext(AuthContext);
   if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context
};