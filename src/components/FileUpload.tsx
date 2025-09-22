'use client'
import { useMutation } from '@tanstack/react-query';
import { Inbox, Loader2 } from 'lucide-react';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { uploadFileToS3 } from '@/lib/s3';
import { useRouter } from 'next/navigation';

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({file_key, file_name}
      : {file_key: string, file_name: string}
    ) => {
      console.log('Creating chat with file:', file_key, file_name);
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name
      });
      return response.data;
    }
  });

  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      setUploading(true);
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit.');
        toast.error('File size exceeds 10MB limit.');
        console.log('File ready for upload:', file);
      }
      try {
        const data = await uploadFileToS3(file);
        if (!data?.file_key || !data?.file_name) {
          toast.error('Algo salio mal al subir el archivo a S3');
          return;
        }
        mutate(data, {
          onSuccess: ({ chat_id }) => {
            router.push(`/chat/${chat_id}`);
            toast.success('Chat created successfully!');
          },
          onError: (err) => {
            toast.error('Error creating chat. Please try again.');
            console.error('Error creating chat with file:', err);
          }
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setUploading(false);
      }
    }
  }); 
  return (
    <div className='p-2 bg-white rounded-xl'>
      <div {...getRootProps({
        className: 'border-dashed border-2 border-gray-50 py-8 rounded-xl cursor-pointer flex justify-center items-center flex-col'
      })}>
        <input {...getInputProps()}/>
        {(uploading || isPending) ? (
          <>
            <Loader2 className='w-10 h-10 text-blue-500 animate-spin' />
            <p className='mt-2 text-sm text-slate-400'>Uploading...</p>
          </>
        ) : (
          <>
            <Inbox className='w-10 h-10 text-blue-500'/>
            <p className='mt-2 text-sm text-slate-400'>Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  )
};

export default FileUpload;