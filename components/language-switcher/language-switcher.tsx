import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CountryFlag from 'react-country-flag';

export function LanguageSwitcher() {
    const [currentLanguage, setCurrentLanguage] = useState('FR');

    const languages = [
        { code: 'FR', name: 'Français', flag: 'fr' }, // Use lowercase country codes
        { code: 'EN', name: 'English', flag: 'gb' },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="border-none text-ejaar-800 hover:bg-ejaar-50 hover:text-ejaar-700 flex items-center gap-2"
                >
                    <CountryFlag
                        countryCode={currentLanguage === 'FR' ? 'FR' : 'GB'}
                        svg
                        style={{
                            width: '1.25rem',
                            height: '1.25rem',
                            borderRadius: '50%',
                        }}
                    />
                    {currentLanguage}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-0">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setCurrentLanguage(lang.code)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <CountryFlag
                            countryCode={lang.flag}
                            svg
                            style={{
                                width: '1.25rem',
                                height: '1.25rem',
                                borderRadius: '50%',
                            }}
                        />
                        {lang.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
