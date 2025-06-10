import {useState} from "react";
import {Button} from "@/components/ui/button";
import {MessageCircle, Send, Settings, User, X} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";
import {useChatContext} from "@/contexts/chat-context";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";

const ChatWidget: React.FC = () => {
    const {
        messages,
        isOpen,
        setIsOpen,
        sendMessage,
        isAdminMode,
        setIsAdminMode,
        users,
        selectedUserId,
        setSelectedUserId,
        getUserMessages,
        sendAdminMessage
    } = useChatContext();

    const [inputText, setInputText] = useState('');
    const [adminInputText, setAdminInputText] = useState('');

    const handleSendMessage = () => {
        if (inputText.trim()) {
            sendMessage(inputText.trim());
            setInputText('');
        }
    };

    const handleSendAdminMessage = () => {
        if (adminInputText.trim() && selectedUserId) {
            sendAdminMessage(selectedUserId, adminInputText.trim());
            setAdminInputText('');
        }
    };


    const formatTime = (isoString: Date) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full bg-ejaar-red hover:bg-ejaar-redHover shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                    size="icon"
                >
                    <MessageCircle className="h-6 w-6 text-white" />
                </Button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl border animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-ejaar-700 to-ejaar-900 rounded-t-lg">
                <div className="flex items-center gap-3">

                    <div>
                        <h3 className="font-semibold text-white text-sm">
                           Support Ejaar
                        </h3>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => setIsOpen(false)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Admin Mode */}
            {isAdminMode ? (
                <div className="h-[calc(100%-80px)]  flex  flex-col gap-2">
                    {/* User List */}
                    <div className="w-full border-r bg-gray-50 flex">
                        <div className="w-full flex overflow-x-auto">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => setSelectedUserId(user.id ?? '')}
                                    className={cn(
                                        "p-3 border-r cursor-pointer hover:bg-gray-100 transition-colors",
                                        selectedUserId === user.id && "bg-blue-100 border-blue-200"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-xs truncate">{user.email}</p>
                                        </div>
                                        {(user.unreadCount ?? 0) > 0 && (
                                            <Badge variant="destructive" className="h-5 w-5 text-xs pl-1.5">
                                                {user.unreadCount}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {selectedUserId ? (
                            <>
                                <ScrollArea className="flex-1 p-4">
                                    <div className="space-y-3 max-h-[300px]">
                                        {getUserMessages(selectedUserId).map((message) => {
                                            const user = users.find(u => u.id === selectedUserId);
                                            return (
                                                <div
                                                    key={message.id}
                                                    className={cn(
                                                        "flex flex-col",
                                                        message.type === 'admin' ? "items-end" : "items-start"
                                                    )}
                                                >
                                                    <div className="text-xs text-gray-500 mb-1">
                                                        {message.type === 'admin' ? 'Admin' : user?.email || 'User'}
                                                    </div>
                                                    <div
                                                        className={cn(
                                                            "max-w-[80%] p-3 rounded-lg text-sm",
                                                            message.type === 'admin'
                                                                ? "bg-ejaar-900 text-white rounded-br-none"
                                                                : "bg-gray-100 text-gray-900 rounded-bl-none"
                                                        )}
                                                    >
                                                        <p>{message.message}</p>
                                                        <p className={cn(
                                                            "text-xs mt-1",
                                                            message.type === 'admin' ? "text-blue-100" : "text-gray-500"
                                                        )}>
                                                            {formatTime(message.createdAt)}
                                                            {message.isVoice && " 🎤"}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>
                                <div className="p-4 border-t">
                                    <div className="flex gap-2">
                                        <Input
                                            value={adminInputText}
                                            onChange={(e) => setAdminInputText(e.target.value)}
                                            placeholder="Écrire..."
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendAdminMessage()}
                                            className="flex-1"
                                        />
                                        <Button
                                            onClick={handleSendAdminMessage}
                                            disabled={!adminInputText.trim()}
                                            size="icon"
                                            className="bg-ejaar-red hover:bg-ejaar-redHover"
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                <p className="text-sm">Sélectionnez une conversation à afficher</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* User Mode */
                <>
                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4 h-[calc(100%-140px)]">
                        <div className="space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 py-8">
                                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p className="text-sm">Commencez une conversation!</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Le support vous répondra dans les plus brefs délais
                                    </p>
                                </div>
                            )}
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={cn(
                                        "flex flex-col",
                                        message.type === 'user' ? "items-end" : "items-start"
                                    )}
                                >
                                    <div className="text-xs text-gray-500 mb-1">
                                        {message.type === 'user' ? 'You' : 'Support'}
                                    </div>
                                    <div
                                        className={cn(
                                            "max-w-[80%] p-3 rounded-lg",
                                            message.type === 'user'
                                                ? "bg-ejaar-900 text-white rounded-br-none"
                                                : "bg-gray-100 text-gray-900 rounded-bl-none"
                                        )}
                                    >
                                        <p className="text-sm">{message.message}</p>
                                        <p className={cn(
                                            "text-xs mt-1",
                                            message.type === 'user' ? "text-blue-100" : "text-gray-500"
                                        )}>
                                            {formatTime(message.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    {/* Input */}
                    <div className="p-4 border-t">
                        <div className="flex gap-2">
                            <Input
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type your message..."
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!inputText.trim()}
                                size="icon"
                                className="bg-ejaar-red hover:bg-ejaar-redHover"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatWidget;
