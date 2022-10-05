import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm, RegisterOptions, FieldError } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: true,
      validate: (file: FileList) => {
        if (file.item(0).size / 1024 / 1024 > 10)
          return 'O arquivo deve ser menor que 10MB';
        if (!file.item(0).type.match(/image\/jpeg|image\/png|image\/gif/))
          return 'Somente são aceitos arquivos PNG, JPEG e GIF';

        return true;
      },
    } as RegisterOptions,
    title: {
      required: true,
      min: 2,
      max: 20,
    } as RegisterOptions,
    description: {
      required: true,
      max: 65,
    } as RegisterOptions,
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (formData: Record<string, unknown>) => api.post('/api/images', formData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['images']);
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'info',
        });

        return;
      }

      const todo = await mutation.mutateAsync({
        ...data,
        url: imageUrl,
      });

      if (todo) {
        toast({
          title: 'Imagem cadastrada',
          description: 'Sua imagem foi cadastrada com sucesso.',
          status: 'success',
        });
      }
    } catch (error) {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
      });
    } finally {
      setImageUrl('');
      reset();
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors?.image as unknown as FieldError}
          {...register('image', formValidations.image)}
        />

        <TextInput
          error={errors?.title as unknown as FieldError}
          placeholder="Título da imagem..."
          {...register('title', formValidations.title)}
        />

        <TextInput
          error={errors?.description as unknown as FieldError}
          placeholder="Descrição da imagem..."
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
