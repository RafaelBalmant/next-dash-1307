'use client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import supabase from '@/lib/database';
import { AlertCircleIcon } from 'lucide-react';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';

interface userInterface {
  uuid: string | null;
  email: string | null;
  chat_uuid: string | null;
}

const ChatPage: FC = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState<true | false>(false);
  const [error, setError] = useState<true | false>(false);
  const [user, setUser] = useState<userInterface>({
    uuid: null,
    email: null,
    chat_uuid: null,
  });
  const [modalRegisterState, setModalRegisterState] = useState(true);
  const [email, setEmail] = useState('');
  const divRef = useRef<HTMLDivElement>(null);

  const insertDatabase = useCallback(
    async (message: string, type: 'user' | 'assistant' = 'user') => {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          type,
          user_uuid: user.uuid,
          chat_uuid: user.chat_uuid,
          email: user.email,
          message,
        })
        .select();
      if (data) console.log('suppabase => inserted document', data);
      if (error) console.log('suppabase => error', error);
    },
    [user],
  );

  const submitPrompt = useCallback(
    async (prompt: string) => {
      const { data: records } = await supabase.from('messages').select('*').eq('email', user.email);

      const historyMessages = records?.map(({ message, type }) => ({
        role: type,
        content: message,
      }));

      if (!prompt) {
        return setError(true);
      }
      setError(false);

      setMessages([...messages, prompt]);
      setLoading(true);

      const response = await fetch('/api/openai', {
        method: 'POST',
        body: JSON.stringify({ prompt, historyMessages }),
      });

      const data = await response.json();
      await insertDatabase(prompt, 'user');
      await insertDatabase(data.message, 'assistant');
      setLoading(false);
      setMessages([...messages, prompt, data.message]);
      setPrompt('');
    },
    [user.email, messages, insertDatabase],
  );

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTo({
        top: divRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const verifyRegister = useCallback(async () => {
    const { data, error } = await supabase.from('messages').select('*').eq('email', email);
    if (error) console.log(error);
    if (data) console.log(data);
    setModalRegisterState(false);
    setUser({
      uuid: data?.length ? data[0].user_uuid : uuidv4(),
      email: data?.length ? data[0].email : email,
      chat_uuid: data?.length ? data[0].chat_uuid : uuidv4(),
    });
  }, [email]);

  return (
    <div>
      <div className="fixed w-full lg:w-1/2 lg:left-1/2 lg:-translate-x-1/2 max-h-[80vh] overflow-auto p-2" ref={divRef}>
        <Dialog open={modalRegisterState} onOpenChange={setModalRegisterState}>
          <DialogContent>
            <DialogHeader>
              <h2 className="text-lg font-semibold">Informe seu e-mail</h2>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <Input onChange={(event) => setEmail(event.target.value)} type="text" placeholder="seu@email.com" />
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={verifyRegister}>Enviar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {messages.map((message, index) => (
          <Card key={index} className="mt-5">
            <CardHeader>
              <CardTitle>
                <div className="flex justify-end">
                  <p className={`${index % 2 === 0 ? 'text-right' : ''} mt-1`}>{index % 2 === 0 ? 'Rafael' : 'Chat GPT'}</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={index % 2 === 0 ? 'text-right' : 'IA'}>
                <ReactMarkdown>{message}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        ))}
        {loading ? (
          <div className="m-auto w-1/2 mt-5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="280" height="50">
              <circle fill="#000000" stroke="#000000" stroke-width="15" r="15" cx="40" cy="65">
                <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
              </circle>
              <circle fill="#000000" stroke="#000000" stroke-width="15" r="15" cx="100" cy="65">
                <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
              </circle>
              <circle fill="#000000" stroke="#000000" stroke-width="15" r="15" cx="160" cy="65">
                <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
              </circle>
            </svg>
          </div>
        ) : (
          ''
        )}
      </div>
      <div className="fixed w-full bottom-0 lg:left-1/2 lg:-translate-x-1/2 lg:w-1/2 p-2">
        <div className="flex flex-col">
          {error && (
            <Alert variant="destructive" className="mb-2">
              <AlertCircleIcon />
              <AlertDescription>
                <p>Por favor, insira uma mensagem</p>
              </AlertDescription>
            </Alert>
          )}
          <Textarea
            className="h-24 resize-none overflow-y-auto"
            onFocus={() => {
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth',
              });
            }}
            disabled={loading}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitPrompt(prompt);
              }
            }}
          />
          {user.email ? (
            <Button onClick={() => submitPrompt(prompt)} className="mt-2 h-10 cursor-pointer" disabled={loading}>
              Enviar
            </Button>
          ) : (
            <Button onClick={() => setModalRegisterState(true)} className="mt-2 h-10 cursor-pointer" disabled={loading}>
              Cadastrar Email
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
