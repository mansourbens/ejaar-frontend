"use client"
import {User} from "@/app/users/page";
import {createContext, useContext, useEffect, useState} from "react";
import {fetchWithToken, UserRole} from "@/lib/utils";
import {useAuth} from "@/components/auth/auth-provider";

export interface Message {
    id?: string;
    message: string;
    type: 'user' | 'admin';
    createdAt: Date;
    email?: string;
    isVoice?: boolean;
    senderId?: number;
}

export interface ChatContextType {
    // User mode
    messages: Message[];
    isOpen: boolean;
    isRecording: boolean;
    setIsOpen: (open: boolean) => void;
    sendMessage: (text: string, isVoice?: boolean) => void;

    // Admin mode
    isAdminMode: boolean;
    setIsAdminMode: (mode: boolean) => void;
    users: User[];
    selectedUserId: string | null;
    setSelectedUserId: (userId: string | null) => void;
    getUserMessages: (userId: string) => Message[];
    sendAdminMessage: (userId: string, text: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {user} = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [allMessages, setAllMessages] = useState<Message[]>([]);

    // Initialize with mock data
    useEffect(() => {

        const getAllChats = async() => {
            const resp = await fetchWithToken(
                `${process.env.NEXT_PUBLIC_API_URL}/api/chat/admin/messages`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            const allMsgs = await resp.json();
            setAllMessages(allMsgs);
        }
        if (user && user.role.name === UserRole.SUPER_ADMIN) {
            setIsAdminMode(true);
            getAllChats();
        }

    }, [user]);
    // Initialize with mock data
    useEffect(() => {
        const getChatUsers = async() => {
            const resp = await fetchWithToken(
                `${process.env.NEXT_PUBLIC_API_URL}/api/chat/users`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            const usrs = await resp.json();
            setUsers(usrs);
        }
        if (user) {
            getChatUsers();
        }

    }, [user]);

    useEffect(() => {

        const getOwnMessages = async() => {
            const resp = await fetchWithToken(
                `${process.env.NEXT_PUBLIC_API_URL}/api/chat/user/messages/${user?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const msgs = await resp.json();
            setMessages(msgs);
        }
        if (user) {
            getOwnMessages();
        }
    }, [user]);


    const sendMessage = async (text: string, isVoice = false) => {
        if (!user?.id) { return;}
        const newMessage: Message = {
            message: text,
            type: 'user',
            createdAt: new Date(),
            email: user?.email,
            senderId: +user?.id
        };

        await
            fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/user/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMessage),
        });

        if (isAdminMode) {
            setAllMessages(prev => [...prev, newMessage]);
        } else {
            setMessages(prev => [...prev, newMessage]);

            if (messages.filter(message => message.type === 'admin').length === 0) {
                setTimeout(async () => {
                    if (!user?.id) { return;}
                    const adminResponse: Message = {
                        message: "Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.",
                        type: 'admin',
                        createdAt: new Date(),
                        email: user?.email,
                        senderId: +user?.id
                    };
                    await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/admin/users/message`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(adminResponse),
                    });
                    setMessages(prev => [...prev, adminResponse]);
                }, 1000 + Math.random() * 1000);
            }

        }
    };

    const sendAdminMessage = async (userId: string, text: string) => {
        const newMessage: Message = {
            message: text,
            type: 'admin',
            createdAt: new Date(),
            email: user?.email,
            senderId: +userId
        };

        await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/admin/users/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMessage),
        });
        setAllMessages(prev => [...prev, newMessage]);
    };

    const getUserMessages = (userId: string) => {
       return allMessages.filter( msg => msg.senderId === +userId);
    };


    return (
        <ChatContext.Provider value={{
            messages,
            isOpen,
            isRecording,
            setIsOpen,
            sendMessage,
            isAdminMode,
            setIsAdminMode,
            users,
            selectedUserId,
            setSelectedUserId,
            getUserMessages,
            sendAdminMessage
        }}>
            {children}
        </ChatContext.Provider>
    );
};
