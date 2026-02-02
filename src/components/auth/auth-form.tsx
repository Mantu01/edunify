'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HTMLInputTypeAttribute, useEffect, useState } from "react";
import { loginSchema, LoginSchemaType, signupSchema, SignupSchemaType } from "@/lib/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Logo from "../logo/logo";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { roleColors, USER_TYPE } from "@/lib/constants";
import { useSearchParams, useRouter } from "next/navigation";
import SocialLogins from "./social-links";

export interface InputFieldTypes {
  name: keyof LoginSchemaType | keyof SignupSchemaType,
  type: HTMLInputTypeAttribute,
  placeholder: string,
  label: string,
}

interface AuthFormProps {
  mode: 'login' | 'signup',
  inputFields: InputFieldTypes[],
}

function FormInput({ mode, inputFields }: AuthFormProps) {

  const searchParams = useSearchParams();
  const router = useRouter();
  const roleParam = searchParams.get('role');
  
  const getValidRole = (param: string | null): 'student' | 'teacher' | 'founder' => {
    if (param === 'student' || param === 'teacher' || param === 'founder') {
      return param;
    }
    return 'student';
  };

  const [role, setRole] = useState<'student' | 'teacher' | 'founder'>(() => getValidRole(roleParam));

  const schema = mode === 'login' ? loginSchema : signupSchema;
  const colors = roleColors[role];
  
  const form = useForm<LoginSchemaType | SignupSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: mode === 'login' 
      ? { email: '', password: '', role } 
      : { username: '', email: '', password: '', confirmPassword: '', role }
  });

  useEffect(() => {
    const validRole = getValidRole(roleParam);
    if (validRole !== role) {
      setRole(validRole);
      form.setValue('role', validRole);
    }
  }, [roleParam, role, form]);

  const watchedRole = form.watch('role');
  
  useEffect(() => {
    if (watchedRole && watchedRole !== roleParam) {
      const currentPath = mode === 'login' ? '/login' : '/signup';
      router.replace(`${currentPath}?role=${watchedRole}`);
    }
  }, [watchedRole, roleParam, mode, router]);

  const {handleSubmit: handleAuthSubmit,isLoading,showError}=useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-4 bg-linear-to-b from-yellow-50/20 via-white to-orange-50/20 dark:from-gray-950 dark:via-black dark:to-gray-900">
      <Card className={`w-full max-w-md shadow-lg rounded-2xl overflow-hidden border-2 ${colors.border} ${colors.bg} ${colors.darkBorder} ${colors.darkBg}`}>
        <CardHeader className="space-y-6 px-8 pt-8 border-b border-border/40">
          <div className="flex justify-center">
            <Logo />
          </div>
          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-base text-gray-600 dark:text-gray-300">
              {mode === 'login' 
                ? `Sign in to continue as ${role}` 
                : `Join as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </CardDescription>
          </div>

          {showError && (
            <div className="flex items-center gap-2 p-3 text-sm border border-red-200 bg-red-50/30 text-red-700 rounded-lg dark:border-red-900 dark:bg-red-950/20 dark:text-red-400">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Invalid credentials. Please try again.</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="px-8 pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => handleAuthSubmit(data, mode))} className="space-y-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Select Role</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-4"
                      >
                        {USER_TYPE.map((type) => (
                          <div key={type.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={type.value} id={type.value} />
                            <Label htmlFor={type.value} className="cursor-pointer text-sm font-normal">
                              {type.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {inputFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">{field.label}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder={field.placeholder}
                            type={
                              field.name === 'password' 
                                ? showPassword ? 'text' : 'password'
                                : field.name === 'confirmPassword'
                                ? showConfirmPassword ? 'text' : 'password'
                                : field.type
                            }
                            {...formField}
                            className="pr-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                            disabled={isLoading}
                          />
                          {(field.name === 'password' || field.name === 'confirmPassword') && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={
                                field.name === 'password'
                                  ? togglePasswordVisibility
                                  : toggleConfirmPasswordVisibility
                              }
                              disabled={isLoading}
                            >
                              {field.name === 'password' ? (
                                showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )
                              ) : showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              ))}
              <Button 
                type="submit" 
                className={`w-full mt-2 ${colors.button} text-white`}
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
          </Form>
          <SocialLogins mode={mode} providers={['google','github']} />
        </CardContent>
        <CardFooter className="flex justify-center pt-4 border-t border-border/40">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <Button 
              variant="link" 
              className="p-0 font-medium text-yellow-600 hover:text-yellow-700 dark:text-yellow-400" 
            >
              {mode === 'login' ? (
                <Link href={`/signup?role=${role}`}>Sign Up</Link>
              ) : (
                <Link href={`/login?role=${role}`}>Login</Link>
              )}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function AuthForm({ mode, inputFields }: AuthFormProps){
  return <FormInput mode={mode} inputFields={inputFields}/>;
}
